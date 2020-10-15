import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const App = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchInputRef = useRef();

  useEffect(() => {
    getResults();
  }, [])

  const getResults = async () => {
    setLoading(true);

    try {
      const response = await axios
        .get(`http://hn.algolia.com/api/v1/search?query=${query}`);
      setResults(response.data.hits);
    } catch (err) {
      setError(err)
    }
    setLoading(false);
  }

  const handleClear = () => {
    setQuery('');
    searchInputRef.current.focus()
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    getResults();
  }

  return (
    <>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        onChange={(event) => {setQuery(event.target.value)}}
        value={query}
        ref={searchInputRef} />
      <button type="submit">Search</button>
      <button type="button" onClick={() => handleClear()}>Clear</button>
    </form>
    {loading ? (
      <div>Loading</div>
    ) : (
        <ul>
        {results.map(result => (
          <li key={result.objectID}>
            <a href={result.url}>{result.title}</a>
          </li>
        ))}
      </ul>
      )
    }

    {error && <div>{error.message}</div>}
    </>
  )
}

export default App;
