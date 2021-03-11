import { useState, useEffect } from 'react'
import { useQuery } from 'react-query';
//styles
import { Wrapper } from './styles/App.styles';

type BitCoinData = {
  '15m': number;
  buy: number;
  last: number;
  sell: number;
  symbol: string;
}

type Currencies = {
  [key: string]: BitCoinData; 
}

const getBCData = async (): Promise<Currencies>  =>
  await (await fetch('https://blockchain.info/ticker')).json();

const INTERVAL_TIME = 30000; //30 seconds  

const App = () => {
  const [currency, setCurrency] = useState('USD');
  const { data, isLoading, error, refetch } = useQuery<Currencies>('bc-data',getBCData);
  console.log('Refetching data');
  const handleCurrencySelection = (e: any) => {
    setCurrency(e.currentTarget.value);
  }  

  useEffect(() => {
    const interval = setInterval(refetch,INTERVAL_TIME)
    return () => clearInterval(interval)
  }, [refetch])

  if (isLoading) return <div>Loading ... </div>
  if (error) return <div>Something went horribly wrong ... </div>

  return (
    <Wrapper>
      <>
        <h2>Bitcoin Price</h2>
        <select value={currency} onChange={handleCurrencySelection}> 
          //short circuit, only if data was returned 
          {data && Object.keys(data).map(currency => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
        <div>
          <h2>
            {data && data[currency].symbol}
            {data && data[currency].last}
          </h2>
        </div>
      </>
    </Wrapper>
  );
  
  
}

export default App;
