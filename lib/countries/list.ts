/** ISO 3166-1 alpha-2 countries for nationality (kokuseki) picker. */
export type CountryOption = { value: string; label: string };

/** UN member states + common territories (195+). */
const ISO_ALPHA2 = [
  "AF", "AL", "DZ", "AD", "AO", "AG", "AR", "AM", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ",
  "BJ", "BT", "BO", "BA", "BW", "BR", "BN", "BG", "BF", "BI", "CV", "KH", "CM", "CA", "CF", "TD", "CL", "CN",
  "CO", "KM", "CG", "CD", "CR", "CI", "HR", "CU", "CY", "CZ", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ",
  "ER", "EE", "SZ", "ET", "FJ", "FI", "FR", "GA", "GM", "GE", "DE", "GH", "GR", "GD", "GT", "GN", "GW", "GY",
  "HT", "HN", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IL", "IT", "JM", "JP", "JO", "KZ", "KE", "KI", "KP",
  "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MG", "MW", "MY", "MV", "ML", "MT",
  "MH", "MR", "MU", "MX", "FM", "MD", "MC", "MN", "ME", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NZ", "NI",
  "NE", "NG", "MK", "NO", "OM", "PK", "PW", "PA", "PG", "PY", "PE", "PH", "PL", "PT", "QA", "RO", "RU", "RW",
  "KN", "LC", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SK", "SI", "SB", "SO", "ZA", "SS",
  "ES", "LK", "SD", "SR", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TO", "TT", "TN", "TR", "TM",
  "TV", "UG", "UA", "AE", "GB", "US", "UY", "UZ", "VU", "VE", "VN", "YE", "ZM", "ZW", "HK", "MO", "PS", "VA",
  "XK", "GL", "PR", "GU", "VI", "AS", "MP", "FO", "GI", "BM", "KY", "AW", "CW", "SX", "BQ", "NC", "PF", "RE",
  "YT", "GF", "GP", "MQ", "PM", "WF", "TK", "NU", "CK", "PN", "SH", "FK", "GS", "IO", "CC", "CX", "NF", "AQ",
] as const;

export function listCountries(locale: string): CountryOption[] {
  const display = new Intl.DisplayNames([locale], { type: "region" });
  return ISO_ALPHA2.map((code) => ({
    value: code,
    label: display.of(code) ?? code,
  })).sort((a, b) => a.label.localeCompare(b.label, locale));
}

export function countryLabel(code: string, locale: string): string {
  const display = new Intl.DisplayNames([locale], { type: "region" });
  return display.of(code) ?? code;
}
