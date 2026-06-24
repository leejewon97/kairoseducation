import { PKG_ROMANS } from '../../config/pkg.mjs';

export function enrichPackageItem(pkg, i, { packageCta, packageCtaArrow }) {
  return {
    ...pkg,
    roman: PKG_ROMANS[i] ?? '',
    btnClass: pkg.featured ? 'btn btn-light' : 'btn btn-ghost',
    btnHtml: pkg.featured ? packageCtaArrow : packageCta,
  };
}

export function enrichOriginEn(en) {
  return {
    ...en,
    services: {
      ...en.services,
      packages: en.services.packages.map((p, i) =>
        enrichPackageItem(p, i, {
          packageCta: en.services.packageCta,
          packageCtaArrow: en.services.packageCtaArrow,
        })
      ),
    },
  };
}

export function enrichStudyKoreaEn(en) {
  return {
    ...en,
    packages: {
      ...en.packages,
      items: en.packages.items.map((p, i) =>
        enrichPackageItem(p, i, {
          packageCta: en.packages.packageCta,
          packageCtaArrow: en.packages.packageCtaArrow,
        })
      ),
    },
  };
}
