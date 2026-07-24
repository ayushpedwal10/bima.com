/**
 * Curated hospital dataset for the 8 top markets from the All India dataset.
 * Each hospital is tagged with which insurer networks cover it (cashless empanelment).
 *
 * Coverage logic based on published network sizes:
 *   Care Health   19,000 — broadest, covers almost all
 *   Star Health   14,000 — second broadest
 *   HDFC ERGO     13,000
 *   Tata AIG      12,000
 *   Aditya Birla  11,000
 *   Niva Bupa     10,000
 *   Bajaj Allianz  8,000
 *   Reliance       8,700
 *   ICICI Lombard  6,500 — smallest
 *
 * Policy IDs: P001=HDFC ERGO, P002=Niva Bupa, P003=Star, P004=Care,
 *             P005=AdityaBirla, P006=ICICI, P007=Star(Senior), P008=Bajaj,
 *             P009=TataAIG, P010=Reliance
 *
 * type: "government" | "private" | "super_specialty" | "multispecialty"
 */

export const HOSPITALS = [
  // ─── NEW DELHI ──────────────────────────────────────────────
  { id:"H001", name:"AIIMS New Delhi",               city:"New Delhi", area:"Ansari Nagar",     type:"government",       lat:28.5672, lng:77.2100, beds:2478, plans:["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010"] },
  { id:"H002", name:"Apollo Hospital Sarita Vihar",  city:"New Delhi", area:"Sarita Vihar",     type:"super_specialty",  lat:28.5355, lng:77.2867, beds:710,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H003", name:"Fortis Escorts Heart Institute", city:"New Delhi", area:"Okhla",            type:"super_specialty",  lat:28.5561, lng:77.2588, beds:310,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H004", name:"Max Super Speciality Saket",    city:"New Delhi", area:"Saket",            type:"super_specialty",  lat:28.5244, lng:77.2066, beds:500,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H005", name:"BLK-Max Super Speciality",      city:"New Delhi", area:"Pusa Road",        type:"super_specialty",  lat:28.6392, lng:77.1903, beds:650,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H006", name:"Safdarjung Hospital",            city:"New Delhi", area:"Safdarjung",       type:"government",       lat:28.5688, lng:77.2060, beds:1531, plans:["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010"] },
  { id:"H007", name:"Sir Ganga Ram Hospital",         city:"New Delhi", area:"Rajinder Nagar",   type:"multispecialty",   lat:28.6400, lng:77.1846, beds:675,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H008", name:"Indraprastha Apollo",            city:"New Delhi", area:"Jasola",           type:"super_specialty",  lat:28.5503, lng:77.2906, beds:700,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H009", name:"Moolchand Hospital",             city:"New Delhi", area:"Lajpat Nagar",     type:"multispecialty",   lat:28.5694, lng:77.2378, beds:280,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H010", name:"Holy Family Hospital",           city:"New Delhi", area:"Okhla",            type:"multispecialty",   lat:28.5617, lng:77.2530, beds:225,  plans:["P001","P002","P003","P004","P005","P008","P009","P010"] },
  { id:"H011", name:"RML Hospital",                   city:"New Delhi", area:"Connaught Place",  type:"government",       lat:28.6356, lng:77.2028, beds:1531, plans:["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010"] },
  { id:"H012", name:"Fortis Hospital Shalimar Bagh",  city:"New Delhi", area:"Shalimar Bagh",    type:"multispecialty",   lat:28.7148, lng:77.1707, beds:262,  plans:["P001","P002","P003","P004","P005","P009","P010"] },

  // ─── HYDERABAD ───────────────────────────────────────────────
  { id:"H013", name:"Yashoda Hospital Somajiguda",   city:"Hyderabad", area:"Somajiguda",       type:"super_specialty",  lat:17.4239, lng:78.4512, beds:400,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H014", name:"Apollo Hospital Jubilee Hills",  city:"Hyderabad", area:"Jubilee Hills",    type:"super_specialty",  lat:17.4239, lng:78.4072, beds:450,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H015", name:"KIMS Hospital Secunderabad",    city:"Hyderabad", area:"Secunderabad",     type:"multispecialty",   lat:17.4399, lng:78.4983, beds:350,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H016", name:"Care Hospital Banjara Hills",   city:"Hyderabad", area:"Banjara Hills",    type:"multispecialty",   lat:17.4156, lng:78.4347, beds:300,  plans:["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010"] },
  { id:"H017", name:"Osmania General Hospital",      city:"Hyderabad", area:"Afzalgunj",        type:"government",       lat:17.3850, lng:78.4867, beds:1200, plans:["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010"] },
  { id:"H018", name:"Sunshine Hospital",             city:"Hyderabad", area:"PG Road",          type:"multispecialty",   lat:17.4401, lng:78.4496, beds:500,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H019", name:"Medicover Hospitals Hitech",    city:"Hyderabad", area:"Hitech City",      type:"multispecialty",   lat:17.4435, lng:78.3772, beds:300,  plans:["P001","P002","P003","P004","P005","P008","P009","P010"] },
  { id:"H020", name:"Star Hospital Banjara Hills",   city:"Hyderabad", area:"Banjara Hills",    type:"multispecialty",   lat:17.4101, lng:78.4449, beds:230,  plans:["P001","P002","P003","P004","P005","P008","P009","P010"] },

  // ─── CHENNAI ─────────────────────────────────────────────────
  { id:"H021", name:"Apollo Hospital Greams Road",   city:"Chennai",   area:"Greams Road",      type:"super_specialty",  lat:13.0569, lng:80.2497, beds:560,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H022", name:"Fortis Malar Hospital",         city:"Chennai",   area:"Adyar",            type:"multispecialty",   lat:13.0012, lng:80.2565, beds:180,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H023", name:"MIOT International",            city:"Chennai",   area:"Manapakkam",       type:"super_specialty",  lat:13.0141, lng:80.1832, beds:1000, plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H024", name:"Madras Medical College",        city:"Chennai",   area:"Park Town",        type:"government",       lat:13.0785, lng:80.2619, beds:2600, plans:["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010"] },
  { id:"H025", name:"Vijaya Hospital",               city:"Chennai",   area:"Vadapalani",       type:"multispecialty",   lat:13.0505, lng:80.2120, beds:275,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H026", name:"Kauvery Hospital Alwarpet",     city:"Chennai",   area:"Alwarpet",         type:"multispecialty",   lat:13.0344, lng:80.2513, beds:350,  plans:["P001","P002","P003","P004","P005","P008","P009","P010"] },
  { id:"H027", name:"SRM Global Hospitals",          city:"Chennai",   area:"Vadapalani",       type:"multispecialty",   lat:13.0505, lng:80.2072, beds:400,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H028", name:"MGM Healthcare",                city:"Chennai",   area:"Nelson Manickam",  type:"super_specialty",  lat:13.0693, lng:80.2120, beds:400,  plans:["P001","P002","P003","P004","P005","P009","P010"] },

  // ─── BANGALORE ───────────────────────────────────────────────
  { id:"H029", name:"Manipal Hospital Old Airport",  city:"Bangalore", area:"Old Airport Road", type:"super_specialty",  lat:12.9563, lng:77.6477, beds:650,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H030", name:"Apollo Hospital Bannerghatta",  city:"Bangalore", area:"Bannerghatta Rd",  type:"super_specialty",  lat:12.8982, lng:77.5986, beds:250,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H031", name:"Fortis Hospital Cunningham",    city:"Bangalore", area:"Cunningham Road",  type:"multispecialty",   lat:12.9880, lng:77.5955, beds:270,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H032", name:"Victoria Hospital",             city:"Bangalore", area:"Fort",             type:"government",       lat:12.9716, lng:77.5754, beds:1300, plans:["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010"] },
  { id:"H033", name:"Narayana Health City",          city:"Bangalore", area:"Bommasandra",      type:"super_specialty",  lat:12.8349, lng:77.6729, beds:2000, plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H034", name:"Columbia Asia Hospital Hebbal",  city:"Bangalore", area:"Hebbal",          type:"multispecialty",   lat:13.0358, lng:77.5970, beds:180,  plans:["P001","P002","P003","P004","P005","P008","P009","P010"] },
  { id:"H035", name:"Sakra World Hospital",          city:"Bangalore", area:"Bellandur",        type:"super_specialty",  lat:12.9268, lng:77.6830, beds:350,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H036", name:"MS Ramaiah Hospital",           city:"Bangalore", area:"MSR Nagar",        type:"multispecialty",   lat:13.0219, lng:77.5535, beds:750,  plans:["P001","P002","P003","P004","P005","P009","P010"] },

  // ─── MUMBAI ──────────────────────────────────────────────────
  { id:"H037", name:"Kokilaben Dhirubhai Ambani",    city:"Mumbai",    area:"Andheri West",     type:"super_specialty",  lat:19.1196, lng:72.8265, beds:750,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H038", name:"Lilavati Hospital Bandra",      city:"Mumbai",    area:"Bandra West",      type:"super_specialty",  lat:19.0558, lng:72.8265, beds:323,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H039", name:"KEM Hospital",                  city:"Mumbai",    area:"Parel",            type:"government",       lat:18.9952, lng:72.8415, beds:1800, plans:["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010"] },
  { id:"H040", name:"Hinduja Hospital",              city:"Mumbai",    area:"Mahim",            type:"multispecialty",   lat:19.0388, lng:72.8405, beds:351,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H041", name:"Breach Candy Hospital",         city:"Mumbai",    area:"Breach Candy",     type:"multispecialty",   lat:18.9711, lng:72.8054, beds:120,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H042", name:"Jupiter Hospital Thane",        city:"Mumbai",    area:"Thane West",       type:"super_specialty",  lat:19.1973, lng:72.9762, beds:350,  plans:["P001","P002","P003","P004","P005","P008","P009","P010"] },
  { id:"H043", name:"Fortis Hospital Mulund",        city:"Mumbai",    area:"Mulund West",      type:"multispecialty",   lat:19.1726, lng:72.9568, beds:225,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H044", name:"Nanavati Max Hospital",         city:"Mumbai",    area:"Vile Parle West",  type:"super_specialty",  lat:19.1004, lng:72.8383, beds:350,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },

  // ─── KOLKATA ─────────────────────────────────────────────────
  { id:"H045", name:"AMRI Hospital Salt Lake",       city:"Kolkata",   area:"Salt Lake",        type:"multispecialty",   lat:22.5726, lng:88.4148, beds:350,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H046", name:"Apollo Gleneagles Hospital",    city:"Kolkata",   area:"Canal Circular",   type:"super_specialty",  lat:22.5586, lng:88.3954, beds:710,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H047", name:"SSKM Hospital",                 city:"Kolkata",   area:"Park Circus",      type:"government",       lat:22.5268, lng:88.3551, beds:1778, plans:["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010"] },
  { id:"H048", name:"Fortis Hospital Anandapur",     city:"Kolkata",   area:"EM Bypass",        type:"super_specialty",  lat:22.5018, lng:88.3962, beds:400,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H049", name:"Medica Superspecialty Hospital",city:"Kolkata",   area:"Mukundapur",       type:"super_specialty",  lat:22.4956, lng:88.3855, beds:510,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H050", name:"RN Tagore International",       city:"Kolkata",   area:"Mukundapur",       type:"super_specialty",  lat:22.4991, lng:88.3918, beds:663,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H051", name:"Peerless Hospital",             city:"Kolkata",   area:"Panchasayar",      type:"multispecialty",   lat:22.4862, lng:88.3775, beds:440,  plans:["P001","P002","P003","P004","P005","P008","P009","P010"] },

  // ─── AHMEDABAD ───────────────────────────────────────────────
  { id:"H052", name:"Apollo Hospital Ahmedabad",     city:"Ahmedabad", area:"Bhat",             type:"super_specialty",  lat:23.0735, lng:72.5275, beds:400,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H053", name:"Sterling Hospital",             city:"Ahmedabad", area:"Gurukul",          type:"multispecialty",   lat:23.0509, lng:72.5482, beds:350,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H054", name:"Civil Hospital Ahmedabad",      city:"Ahmedabad", area:"Asarwa",           type:"government",       lat:23.0535, lng:72.6090, beds:2500, plans:["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010"] },
  { id:"H055", name:"Shalby Hospital",               city:"Ahmedabad", area:"SG Highway",       type:"super_specialty",  lat:23.0330, lng:72.5089, beds:300,  plans:["P001","P002","P003","P004","P005","P008","P009","P010"] },
  { id:"H056", name:"CIMS Hospital",                 city:"Ahmedabad", area:"Science City",     type:"super_specialty",  lat:23.0507, lng:72.5078, beds:360,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H057", name:"HCG Hospital",                  city:"Ahmedabad", area:"Mithakhali",       type:"super_specialty",  lat:23.0395, lng:72.5556, beds:250,  plans:["P001","P002","P003","P004","P005","P009","P010"] },

  // ─── PUNE ────────────────────────────────────────────────────
  { id:"H058", name:"Ruby Hall Clinic",              city:"Pune",      area:"Sassoon Road",     type:"super_specialty",  lat:18.5204, lng:73.8776, beds:650,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H059", name:"Jehangir Hospital",             city:"Pune",      area:"Sassoon Road",     type:"multispecialty",   lat:18.5201, lng:73.8771, beds:350,  plans:["P001","P002","P003","P004","P005","P006","P007","P009","P010"] },
  { id:"H060", name:"Sahyadri Hospital Deccan",      city:"Pune",      area:"Deccan Gymkhana",  type:"multispecialty",   lat:18.5148, lng:73.8396, beds:250,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H061", name:"Deenanath Mangeshkar Hospital", city:"Pune",      area:"Erandwane",        type:"multispecialty",   lat:18.5053, lng:73.8299, beds:850,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
  { id:"H062", name:"KEM Hospital Pune",             city:"Pune",      area:"Rasta Peth",       type:"government",       lat:18.5236, lng:73.8662, beds:1300, plans:["P001","P002","P003","P004","P005","P006","P007","P008","P009","P010"] },
  { id:"H063", name:"Columbia Asia Hospital Pune",   city:"Pune",      area:"Kharadi",          type:"multispecialty",   lat:18.5524, lng:73.9430, beds:180,  plans:["P001","P002","P003","P004","P005","P008","P009","P010"] },
  { id:"H064", name:"Poona Hospital & Research",     city:"Pune",      area:"Sadashiv Peth",    type:"multispecialty",   lat:18.5152, lng:73.8551, beds:450,  plans:["P001","P002","P003","P004","P005","P009","P010"] },
]

/** All unique cities in the dataset */
export const HOSPITAL_CITIES = [...new Set(HOSPITALS.map(h => h.city))].sort()

/** All hospital types */
export const HOSPITAL_TYPES = {
  government:      { label: "Government",       color: "#0284c7", bg: "#e0f2fe" },
  private:         { label: "Private",          color: "#7c3aed", bg: "#f5f3ff" },
  super_specialty: { label: "Super Speciality", color: "#dc2626", bg: "#fef2f2" },
  multispecialty:  { label: "Multispeciality",  color: "#059669", bg: "#f0fdf4" },
}

/** Map of policyId → insurer display info */
export const PLAN_META = {
  P001: { short: "HDFC ERGO", color: "#004C8F", abbr: "HE" },
  P002: { short: "Niva Bupa", color: "#E4002B", abbr: "NB" },
  P003: { short: "Star",      color: "#F7941D", abbr: "SH" },
  P004: { short: "Care",      color: "#00A651", abbr: "CH" },
  P005: { short: "Ad. Birla", color: "#E31837", abbr: "AB" },
  P006: { short: "ICICI",     color: "#F58220", abbr: "IL" },
  P007: { short: "Star Sr.",  color: "#F7941D", abbr: "SS" },
  P008: { short: "Bajaj",     color: "#003087", abbr: "BA" },
  P009: { short: "Tata AIG",  color: "#1C2B6E", abbr: "TA" },
  P010: { short: "Reliance",  color: "#0072BC", abbr: "RG" },
}

/**
 * Returns hospitals filtered by city, search query, and plan filter.
 * @param {string} city     - city name or "" for all
 * @param {string} query    - text search (name / area)
 * @param {string} planId   - plan ID to filter by, or "" for all
 */
export function searchHospitals({ city = "", query = "", planId = "" }) {
  return HOSPITALS.filter(h => {
    const matchCity = !city || h.city === city
    const q = query.toLowerCase().trim()
    const matchQuery = !q || h.name.toLowerCase().includes(q) || h.area.toLowerCase().includes(q)
    const matchPlan  = !planId || h.plans.includes(planId)
    return matchCity && matchQuery && matchPlan
  })
}
