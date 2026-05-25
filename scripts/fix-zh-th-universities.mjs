/**
 * en 구조(33개)에 맞추고 zh/th 대학 detail 영문 잔여를 번역으로 채움.
 * node scripts/fix-zh-th-universities.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const en = JSON.parse(fs.readFileSync(path.join(root, 'locales/origin/en.json'), 'utf8'));

/** name → detail (en과 다를 때만 명시; 나머지는 기존 locale 값 유지) */
const ZH_DETAIL = {
  Villanova: '录取并注册',
  'UW Madison': '录取 × 2 名',
  'Boston University': '录取',
  'University of Michigan': '录取',
  UCL: '伦敦大学学院（英国）',
  'Univ. of Toronto': '圣乔治校区（加拿大）',
  'Waseda University': '日本东京',
  'Olin College': '精英工程学院（每年约80名录取）',
};

const TH_DETAIL = {
  Harvard: 'วิทยาศาสตร์สิ่งแวดล้อมและนโยบายสาธารณะ',
  Yale: 'ภาพยนตร์และสื่อ',
  Columbia: 'เศรษศาสตร์และปรัชญา',
  UPenn: 'Wharton — ธุรกิจ (ED1)',
  Dartmouth: 'ความสัมพันธ์ระหว่างประเทศ (ED1)',
  Brown: 'เอเชียตะวันออก (ED)',
  'Carnegie Mellon': 'วิศวกรรม (ED) · ดนตรีและเทคโนโลยี',
  Vanderbilt: 'วิศวกรรม (ED2)',
  Villanova: 'รับเข้าและลงทะเบียนแล้ว',
  'UW Madison': 'รับเข้า × 2 คน',
  'Boston University': 'รับเข้า',
  'University of Michigan': 'รับเข้า',
  UCL: 'University College London (สหราชอาณาจักร)',
  'Univ. of Toronto': 'วิทยาเขต St. George (แคนาดา)',
  'Waseda University': 'โตเกียว ประเทศญี่ปุ่น',
  'Olin College': 'วิศวกรรมชั้นนำ (รับเข้า ~80 คน/ปี)',
};

function indexByName(locale) {
  const map = new Map();
  for (const tier of locale.results.tiers) {
    for (const u of tier.universities) {
      map.set(u.name, u);
    }
  }
  return map;
}

function enDetailByName(name) {
  for (const tier of en.results.tiers) {
    const u = tier.universities.find((x) => x.name === name);
    if (u) return u.detail;
  }
  return '';
}

function fixLocale(locale, overrides) {
  const byName = indexByName(locale);
  locale.results.tiers = en.results.tiers.map((enTier) => {
    const locTier = locale.results.tiers.find((t) => t.label === enTier.label) || locale.results.tiers[en.results.tiers.indexOf(enTier)];
    return {
      label: locTier?.label ?? enTier.label,
      tier: enTier.tier,
      universities: enTier.universities.map((enUni) => {
        const prev = byName.get(enUni.name);
        const enD = enUni.detail;
        let detail = overrides[enUni.name];
        if (!detail && prev && prev.detail !== enD) detail = prev.detail;
        if (!detail) detail = enD;
        return {
          name: enUni.name, // 고유명사: 대학명은 항상 en(영문)과 동일
          detail,
          tier: enUni.tier,
          intl: enUni.intl,
        };
      }),
    };
  });
}

const zh = JSON.parse(fs.readFileSync(path.join(root, 'locales/origin/zh.json'), 'utf8'));
const th = JSON.parse(fs.readFileSync(path.join(root, 'locales/origin/th.json'), 'utf8'));

fixLocale(zh, ZH_DETAIL);
fixLocale(th, TH_DETAIL);

fs.writeFileSync(path.join(root, 'locales/origin/zh.json'), JSON.stringify(zh, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'locales/origin/th.json'), JSON.stringify(th, null, 2) + '\n');

function countEnglish(locale) {
  let n = 0;
  for (const tier of locale.results.tiers) {
    for (const u of tier.universities) {
      if (u.detail === enDetailByName(u.name)) n++;
    }
  }
  return n;
}

console.log('zh universities:', zh.results.tiers.reduce((a, t) => a + t.universities.length, 0));
console.log('th universities:', th.results.tiers.reduce((a, t) => a + t.universities.length, 0));
console.log('zh details still identical to en:', countEnglish(zh));
console.log('th details still identical to en:', countEnglish(th));
