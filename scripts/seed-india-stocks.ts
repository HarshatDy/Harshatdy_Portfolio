import { config } from 'dotenv'
config({ path: '.env.local' })

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const NIFTY_50 = [
  { ticker: 'ADANIENT',   yahoo_ticker: 'ADANIENT.NS',   name: 'Adani Enterprises',              sector: 'Diversified',    active: true },
  { ticker: 'ADANIPORTS', yahoo_ticker: 'ADANIPORTS.NS', name: 'Adani Ports',                    sector: 'Infrastructure', active: true },
  { ticker: 'APOLLOHOSP', yahoo_ticker: 'APOLLOHOSP.NS', name: 'Apollo Hospitals',               sector: 'Healthcare',     active: true },
  { ticker: 'ASIANPAINT', yahoo_ticker: 'ASIANPAINT.NS', name: 'Asian Paints',                   sector: 'Consumer',       active: true },
  { ticker: 'AXISBANK',   yahoo_ticker: 'AXISBANK.NS',   name: 'Axis Bank',                      sector: 'Banking',        active: true },
  { ticker: 'BAJAJ-AUTO', yahoo_ticker: 'BAJAJ-AUTO.NS', name: 'Bajaj Auto',                     sector: 'Auto',           active: true },
  { ticker: 'BAJFINANCE', yahoo_ticker: 'BAJFINANCE.NS', name: 'Bajaj Finance',                  sector: 'Finance',        active: true },
  { ticker: 'BAJAJFINSV', yahoo_ticker: 'BAJAJFINSV.NS', name: 'Bajaj Finserv',                  sector: 'Finance',        active: true },
  { ticker: 'BPCL',       yahoo_ticker: 'BPCL.NS',       name: 'Bharat Petroleum',               sector: 'Energy',         active: true },
  { ticker: 'BHARTIARTL', yahoo_ticker: 'BHARTIARTL.NS', name: 'Bharti Airtel',                  sector: 'Telecom',        active: true },
  { ticker: 'BRITANNIA',  yahoo_ticker: 'BRITANNIA.NS',  name: 'Britannia Industries',           sector: 'FMCG',           active: true },
  { ticker: 'CIPLA',      yahoo_ticker: 'CIPLA.NS',      name: 'Cipla',                          sector: 'Pharma',         active: true },
  { ticker: 'COALINDIA',  yahoo_ticker: 'COALINDIA.NS',  name: 'Coal India',                     sector: 'Energy',         active: true },
  { ticker: 'DIVISLAB',   yahoo_ticker: 'DIVISLAB.NS',   name: "Divi's Laboratories",            sector: 'Pharma',         active: true },
  { ticker: 'DRREDDY',    yahoo_ticker: 'DRREDDY.NS',    name: "Dr. Reddy's Laboratories",       sector: 'Pharma',         active: true },
  { ticker: 'EICHERMOT',  yahoo_ticker: 'EICHERMOT.NS',  name: 'Eicher Motors',                  sector: 'Auto',           active: true },
  { ticker: 'GRASIM',     yahoo_ticker: 'GRASIM.NS',     name: 'Grasim Industries',              sector: 'Diversified',    active: true },
  { ticker: 'HCLTECH',    yahoo_ticker: 'HCLTECH.NS',    name: 'HCL Technologies',               sector: 'IT',             active: true },
  { ticker: 'HDFCBANK',   yahoo_ticker: 'HDFCBANK.NS',   name: 'HDFC Bank',                      sector: 'Banking',        active: true },
  { ticker: 'HDFCLIFE',   yahoo_ticker: 'HDFCLIFE.NS',   name: 'HDFC Life Insurance',            sector: 'Insurance',      active: true },
  { ticker: 'HEROMOTOCO', yahoo_ticker: 'HEROMOTOCO.NS', name: 'Hero MotoCorp',                  sector: 'Auto',           active: true },
  { ticker: 'HINDALCO',   yahoo_ticker: 'HINDALCO.NS',   name: 'Hindalco Industries',            sector: 'Metals',         active: true },
  { ticker: 'HINDUNILVR', yahoo_ticker: 'HINDUNILVR.NS', name: 'Hindustan Unilever',             sector: 'FMCG',           active: true },
  { ticker: 'ICICIBANK',  yahoo_ticker: 'ICICIBANK.NS',  name: 'ICICI Bank',                     sector: 'Banking',        active: true },
  { ticker: 'ITC',        yahoo_ticker: 'ITC.NS',        name: 'ITC Limited',                    sector: 'FMCG',           active: true },
  { ticker: 'INDUSINDBK', yahoo_ticker: 'INDUSINDBK.NS', name: 'IndusInd Bank',                  sector: 'Banking',        active: true },
  { ticker: 'INFY',       yahoo_ticker: 'INFY.NS',       name: 'Infosys',                        sector: 'IT',             active: true },
  { ticker: 'JSWSTEEL',   yahoo_ticker: 'JSWSTEEL.NS',   name: 'JSW Steel',                      sector: 'Metals',         active: true },
  { ticker: 'KOTAKBANK',  yahoo_ticker: 'KOTAKBANK.NS',  name: 'Kotak Mahindra Bank',            sector: 'Banking',        active: true },
  { ticker: 'LT',         yahoo_ticker: 'LT.NS',         name: 'Larsen & Toubro',                sector: 'Infrastructure', active: true },
  { ticker: 'LTIM',       yahoo_ticker: 'LTIM.NS',       name: 'LTIMindtree',                    sector: 'IT',             active: true },
  { ticker: 'M&M',        yahoo_ticker: 'M&M.NS',        name: 'Mahindra & Mahindra',            sector: 'Auto',           active: true },
  { ticker: 'MARUTI',     yahoo_ticker: 'MARUTI.NS',     name: 'Maruti Suzuki',                  sector: 'Auto',           active: true },
  { ticker: 'NESTLEIND',  yahoo_ticker: 'NESTLEIND.NS',  name: 'Nestle India',                   sector: 'FMCG',           active: true },
  { ticker: 'NTPC',       yahoo_ticker: 'NTPC.NS',       name: 'NTPC',                           sector: 'Energy',         active: true },
  { ticker: 'ONGC',       yahoo_ticker: 'ONGC.NS',       name: 'Oil & Natural Gas Corporation',  sector: 'Energy',         active: true },
  { ticker: 'POWERGRID',  yahoo_ticker: 'POWERGRID.NS',  name: 'Power Grid Corporation',         sector: 'Energy',         active: true },
  { ticker: 'RELIANCE',   yahoo_ticker: 'RELIANCE.NS',   name: 'Reliance Industries',            sector: 'Diversified',    active: true },
  { ticker: 'SBILIFE',    yahoo_ticker: 'SBILIFE.NS',    name: 'SBI Life Insurance',             sector: 'Insurance',      active: true },
  { ticker: 'SBIN',       yahoo_ticker: 'SBIN.NS',       name: 'State Bank of India',            sector: 'Banking',        active: true },
  { ticker: 'SUNPHARMA',  yahoo_ticker: 'SUNPHARMA.NS',  name: 'Sun Pharmaceutical',             sector: 'Pharma',         active: true },
  { ticker: 'TCS',        yahoo_ticker: 'TCS.NS',        name: 'Tata Consultancy Services',      sector: 'IT',             active: true },
  { ticker: 'TATACONSUM', yahoo_ticker: 'TATACONSUM.NS', name: 'Tata Consumer Products',         sector: 'FMCG',           active: true },
  { ticker: 'TATAMOTORS', yahoo_ticker: 'TATAMOTORS.NS', name: 'Tata Motors',                    sector: 'Auto',           active: true },
  { ticker: 'TATASTEEL',  yahoo_ticker: 'TATASTEEL.NS',  name: 'Tata Steel',                     sector: 'Metals',         active: true },
  { ticker: 'TECHM',      yahoo_ticker: 'TECHM.NS',      name: 'Tech Mahindra',                  sector: 'IT',             active: true },
  { ticker: 'TITAN',      yahoo_ticker: 'TITAN.NS',      name: 'Titan Company',                  sector: 'Consumer',       active: true },
  { ticker: 'ULTRACEMCO', yahoo_ticker: 'ULTRACEMCO.NS', name: 'UltraTech Cement',               sector: 'Materials',      active: true },
  { ticker: 'WIPRO',      yahoo_ticker: 'WIPRO.NS',      name: 'Wipro',                          sector: 'IT',             active: true },
  { ticker: 'SHRIRAMFIN', yahoo_ticker: 'SHRIRAMFIN.NS', name: 'Shriram Finance',                sector: 'Finance',        active: true },
]

async function main() {
  console.log(`Seeding ${NIFTY_50.length} Nifty 50 stocks…`)

  const { data, error } = await supabase
    .from('indian_stocks')
    .upsert(NIFTY_50, { onConflict: 'ticker' })
    .select()

  if (error) {
    console.error('Seed failed:', error.message)
    process.exit(1)
  }

  console.log(`Successfully upserted ${data?.length ?? 0} stocks.`)
  console.log('Done.')
}

main()
