/**
 * MD 테이블 → Figma Variables JSON 변환기
 * 
 * 사용법:
 *   cd base-sentences
 *   node md-to-figma-variables.js
 * 
 * 입력: base-sentences/ 폴더 내 *.md 파일들
 * 출력: figma-variables.json (Figma Variables import용)
 * 
 * prefix 규칙:
 *   루트 파일:
 *     01-basic-info.md       → basic-* (Cover, Skills 섹션만 포함)
 *     02-projects.md         → 섹션별로 ht-*, qlt-*, mmt-*, skel-*, plog-*
 * 
 *   프로젝트 폴더:
 *     03-hightraffic/XX-*.md → htXX-*
 *     04-qlt/XX-*.md         → qltXX-*
 *     05-mmt/XX-*.md         → mmtXX-*
 *     06-skeleton/XX-*.md    → skelXX-*
 *     07-plogging/XX-*.md    → plogXX-*
 * 
 *   제외:
 *     00-methodology.md
 *     templates/
 */

const fs = require('fs');
const path = require('path');

// ===== 설정 =====

// 루트 파일 → prefix 매핑 (02-projects, 01-basic-info는 특별 처리)
const ROOT_FILE_PREFIX = {
  '01-basic-info': 'basic',
};

// 01-basic-info.md에서 포함할 섹션들
const BASIC_INCLUDE_SECTIONS = ['Cover', 'Skills'];

// 02-projects.md 섹션 헤더 → prefix 매핑
const PROJECT_SECTION_PREFIX = {
  'High-Traffic': 'ht',
  'Quick Label Timer': 'qlt',
  'My Math Teacher': 'mmt',
  'Skeleton Gym': 'skel',
  'Plogging': 'plog',
};

// 프로젝트 폴더 → prefix 매핑
const FOLDER_PREFIX = {
  '03-hightraffic': 'ht',
  '04-qlt': 'qlt',
  '05-mmt': 'mmt',
  '06-skeleton': 'skel',
  '07-plogging': 'plog',
};

// 제외할 파일/폴더
const EXCLUDE = ['00-methodology.md', 'templates'];

// 출력 파일명
const OUTPUT_FILE = 'figma-variables.json';

// ===== 함수 =====

/**
 * MD 파일에서 테이블의 key-value 쌍 추출 (전체 파일)
 */
function parseMarkdownTables(mdContent, prefix) {
  const variables = {};
  
  const lines = mdContent.split('\n');
  let inTable = false;
  let headerParsed = false;
  
  for (const line of lines) {
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      // 헤더 행 (key | value)
      if (cells[0]?.toLowerCase() === 'key' && cells[1]?.toLowerCase() === 'value') {
        inTable = true;
        headerParsed = false;
        continue;
      }
      
      // 구분선 (---|---)
      if (cells[0]?.startsWith('-') && cells[1]?.startsWith('-')) {
        headerParsed = true;
        continue;
      }
      
      // 데이터 행
      if (inTable && headerParsed && cells.length >= 2) {
        const key = cells[0];
        const value = cells[1];
        const fullKey = `${prefix}-${key}`;
        
        variables[fullKey] = {
          "$type": "string",
          "$value": value
        };
      }
    } else if (!line.startsWith('|') && line.trim() !== '') {
      if (inTable && headerParsed) {
        inTable = false;
        headerParsed = false;
      }
    }
  }
  
  return variables;
}

/**
 * 01-basic-info.md 파일을 섹션별로 파싱
 * BASIC_INCLUDE_SECTIONS에 포함된 섹션만 추출
 */
function parseBasicInfoFile(mdContent, prefix) {
  const variables = {};
  const processedSections = [];
  
  const lines = mdContent.split('\n');
  let currentSectionIncluded = false;
  let inTable = false;
  let headerParsed = false;
  
  for (const line of lines) {
    // ## 헤더 감지 → 포함 여부 결정
    if (line.startsWith('## ')) {
      const headerText = line.substring(3).trim();
      
      // 포함할 섹션인지 체크
      currentSectionIncluded = BASIC_INCLUDE_SECTIONS.some(section => 
        headerText.includes(section)
      );
      
      if (currentSectionIncluded) {
        processedSections.push(headerText);
      }
      
      // 테이블 상태 리셋
      inTable = false;
      headerParsed = false;
      continue;
    }
    
    // 포함 대상 섹션이 아니면 스킵
    if (!currentSectionIncluded) continue;
    
    // 테이블 파싱
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      // 헤더 행 (key | value)
      if (cells[0]?.toLowerCase() === 'key' && cells[1]?.toLowerCase() === 'value') {
        inTable = true;
        headerParsed = false;
        continue;
      }
      
      // 구분선 (---|---)
      if (cells[0]?.startsWith('-') && cells[1]?.startsWith('-')) {
        headerParsed = true;
        continue;
      }
      
      // 데이터 행
      if (inTable && headerParsed && cells.length >= 2) {
        const key = cells[0];
        const value = cells[1];
        const fullKey = `${prefix}-${key}`;
        
        variables[fullKey] = {
          "$type": "string",
          "$value": value
        };
      }
    } else if (!line.startsWith('|') && line.trim() !== '' && !line.startsWith('#') && !line.startsWith('<!--')) {
      if (inTable && headerParsed) {
        inTable = false;
        headerParsed = false;
      }
    }
  }
  
  return { variables, processedSections };
}

/**
 * 02-projects.md 파일을 섹션별로 파싱
 * ## 헤더에 따라 다른 prefix 적용
 */
function parseProjectsFile(mdContent) {
  const variables = {};
  const processedSections = [];
  
  const lines = mdContent.split('\n');
  let currentPrefix = null;
  let inTable = false;
  let headerParsed = false;
  
  for (const line of lines) {
    // ## 헤더 감지 → prefix 변경
    if (line.startsWith('## ')) {
      const headerText = line.substring(3).trim();
      
      // 헤더에서 prefix 찾기
      currentPrefix = null;
      for (const [keyword, prefix] of Object.entries(PROJECT_SECTION_PREFIX)) {
        if (headerText.includes(keyword)) {
          currentPrefix = prefix;
          processedSections.push({ header: headerText, prefix: `${prefix}-*` });
          break;
        }
      }
      
      // 테이블 상태 리셋
      inTable = false;
      headerParsed = false;
      continue;
    }
    
    // prefix가 없으면 스킵
    if (!currentPrefix) continue;
    
    // 테이블 파싱
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c);
      
      // 헤더 행 (key | value)
      if (cells[0]?.toLowerCase() === 'key' && cells[1]?.toLowerCase() === 'value') {
        inTable = true;
        headerParsed = false;
        continue;
      }
      
      // 구분선 (---|---)
      if (cells[0]?.startsWith('-') && cells[1]?.startsWith('-')) {
        headerParsed = true;
        continue;
      }
      
      // 데이터 행
      if (inTable && headerParsed && cells.length >= 2) {
        const key = cells[0];
        const value = cells[1];
        const fullKey = `${currentPrefix}-${key}`;
        
        variables[fullKey] = {
          "$type": "string",
          "$value": value
        };
      }
    } else if (!line.startsWith('|') && line.trim() !== '' && !line.startsWith('#') && !line.startsWith('<!--')) {
      if (inTable && headerParsed) {
        inTable = false;
        headerParsed = false;
      }
    }
  }
  
  return { variables, processedSections };
}

/**
 * 파일명에서 번호 추출 (01-index-a.md → 01)
 */
function extractFileNumber(fileName) {
  const match = fileName.match(/^(\d+)-/);
  return match ? match[1] : '';
}

/**
 * 파일명에서 suffix 추출 (04-concurrency-c.md → c)
 * 같은 번호에 여러 파일이 있을 때 구분용
 */
function extractFileSuffix(fileName) {
  const match = fileName.match(/-([a-z])\.md$/);
  return match ? match[1] : '';
}

/**
 * base-sentences 폴더 전체 처리
 */
function processBasesentences(rootDir) {
  let allVariables = {};
  const processedFiles = [];
  const skippedFiles = [];
  
  const items = fs.readdirSync(rootDir);
  
  for (const item of items) {
    const itemPath = path.join(rootDir, item);
    const stat = fs.statSync(itemPath);
    
    // 제외 대상
    if (EXCLUDE.includes(item)) {
      skippedFiles.push({ file: item, reason: '제외 목록' });
      continue;
    }
    
    if (stat.isFile() && item.endsWith('.md')) {
      const fileName = path.basename(item, '.md');
      
      // 02-projects.md 특별 처리
      if (fileName === '02-projects') {
        const content = fs.readFileSync(itemPath, 'utf-8');
        const { variables, processedSections } = parseProjectsFile(content);
        const varCount = Object.keys(variables).length;
        
        const prefixes = processedSections.map(s => s.prefix).join(', ');
        processedFiles.push({ 
          file: item, 
          prefix: prefixes || '(섹션 없음)', 
          varCount 
        });
        allVariables = { ...allVariables, ...variables };
        continue;
      }
      
      // 01-basic-info.md 특별 처리
      if (fileName === '01-basic-info') {
        const content = fs.readFileSync(itemPath, 'utf-8');
        const { variables, processedSections } = parseBasicInfoFile(content, 'basic');
        const varCount = Object.keys(variables).length;
        
        const sections = processedSections.join(', ');
        processedFiles.push({ 
          file: item, 
          prefix: `basic-* (${sections})`, 
          varCount 
        });
        allVariables = { ...allVariables, ...variables };
        continue;
      }
      
      // 일반 루트 MD 파일
      const prefix = ROOT_FILE_PREFIX[fileName];
      
      if (!prefix) {
        skippedFiles.push({ file: item, reason: 'ROOT_FILE_PREFIX에 없음' });
        continue;
      }
      
      const content = fs.readFileSync(itemPath, 'utf-8');
      const variables = parseMarkdownTables(content, prefix);
      const varCount = Object.keys(variables).length;
      
      processedFiles.push({ file: item, prefix: `${prefix}-*`, varCount });
      allVariables = { ...allVariables, ...variables };
      
    } else if (stat.isDirectory()) {
      // 프로젝트 폴더
      const folderPrefix = FOLDER_PREFIX[item];
      
      if (!folderPrefix) {
        skippedFiles.push({ file: item + '/', reason: 'FOLDER_PREFIX에 없음' });
        continue;
      }
      
      // 폴더 내 MD 파일들 처리
      const folderFiles = fs.readdirSync(itemPath).filter(f => f.endsWith('.md'));
      
      for (const file of folderFiles) {
        const filePath = path.join(itemPath, file);
        const fileNum = extractFileNumber(file);
        const fileSuffix = extractFileSuffix(file);
        
        // prefix 생성: ht01a, ht04c, ht04d 등
        const prefix = `${folderPrefix}${fileNum}${fileSuffix}`;
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const variables = parseMarkdownTables(content, prefix);
        const varCount = Object.keys(variables).length;
        
        processedFiles.push({ 
          file: `${item}/${file}`, 
          prefix: `${prefix}-*`, 
          varCount 
        });
        allVariables = { ...allVariables, ...variables };
      }
    }
  }
  
  return { allVariables, processedFiles, skippedFiles };
}

// ===== 실행 =====

const currentDir = process.cwd();
console.log(`\n📁 작업 디렉토리: ${currentDir}\n`);

const { allVariables, processedFiles, skippedFiles } = processBasesentences(currentDir);

// 결과 출력
console.log('✅ 처리된 파일:');
for (const { file, prefix, varCount } of processedFiles) {
  console.log(`   ${file} → ${prefix} (${varCount}개)`);
}

if (skippedFiles.length > 0) {
  console.log('\n⏭️  스킵된 항목:');
  for (const { file, reason } of skippedFiles) {
    console.log(`   ${file} (${reason})`);
  }
}

// JSON 파일 저장
const outputPath = path.join(currentDir, OUTPUT_FILE);
fs.writeFileSync(outputPath, JSON.stringify(allVariables, null, 2));

const totalVars = Object.keys(allVariables).length;
console.log(`\n📄 출력: ${OUTPUT_FILE} (총 ${totalVars}개 변수)`);
console.log('\n✨ 완료! Figma Variables에서 import 하세요.\n');
