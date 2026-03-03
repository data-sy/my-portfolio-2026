const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// CORS 허용 (Figma 플러그인에서 접근 가능하도록)
app.use(cors());

// 기본 데이터 + 회사별 데이터 병합
app.get('/api/portfolio/:company', (req, res) => {
  try {
    const company = req.params.company;
    
    // 1. 기본 데이터 로드
    const basePath = path.join(__dirname, '../data/base.json');
    const baseData = JSON.parse(fs.readFileSync(basePath, 'utf-8'));
    
    // 2. 회사별 데이터 로드
    const companyPath = path.join(__dirname, `../data/companies/${company}.json`);
    
    if (!fs.existsSync(companyPath)) {
      return res.json({
        success: true,
        data: baseData,
        message: `${company} 커스텀 없음 - 기본 데이터 사용`
      });
    }
    
    const companyData = JSON.parse(fs.readFileSync(companyPath, 'utf-8'));
    
    // 3. 데이터 병합
    const mergedData = {
      ...baseData,
      troubleshooting: {
        ...baseData.troubleshooting,
        ...(companyData.troubleshooting || {})
      },
      highlight: companyData.highlight || null,
      company: company
    };
    
    res.json({
      success: true,
      data: mergedData,
      message: `${company} 데이터 로드 완료`
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 사용 가능한 회사 목록
app.get('/api/companies', (req, res) => {
  const companiesDir = path.join(__dirname, '../data/companies');
  const files = fs.readdirSync(companiesDir);
  const companies = files
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));
  
  res.json({
    success: true,
    companies: companies
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║  🚀 Portfolio PoC Server Running       ║
║                                        ║
║  http://localhost:${PORT}                ║
║                                        ║
║  API:                                  ║
║  - GET /api/companies                  ║
║  - GET /api/portfolio/:company         ║
╚════════════════════════════════════════╝
  `);
});
