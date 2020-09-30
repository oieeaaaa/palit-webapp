import {
  useState,
  useEffect,
  useContext,
} from 'react';
import UserContext from 'js/contexts/user';
import ITEM from 'js/models/item';
import useError from 'js/hooks/useError';
import useProtection from 'js/hooks/useProtection';
import { normalizeData } from 'js/utils';
import Layout from 'components/layout/layout';
import ItemCard, { ItemCardSkeleton } from 'components/itemCard/itemCard';

const Search = () => {
  const user = useContext(UserContext);
  const [displayError] = useError();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * searchItem
   */
  const searchItem = async (e) => {
    e.persist();
    const isEnterKeyPressed = e.charCode === 13;

    if (!isEnterKeyPressed) return;

    setIsLoading(true);

    try {
      const rawResults = await ITEM.search(query);
      const onlyItemsFromOtherUsers = normalizeData(rawResults)
        .filter((result) => result.owner !== user.key);

      setResults(onlyItemsFromOtherUsers);
    } catch (err) {
      displayError(err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * handleSearch.
   *
   * @param {object} e
   */
  const handleSearch = (e) => {
    e.preventDefault();

    setQuery(e.target.value);
  };

  /**
   * renderResults.
   *
   * It should display various UI on various cases
   */
  const renderResults = () => {
    const noItemFound = results && !results.length;
    const isSearching = !results && isLoading;

    if (isSearching) {
      return Array.from({ length: 6 }).map((_, index) => <ItemCardSkeleton key={index} />);
    }

    if (noItemFound) {
      return (
        <div className="tip">
          <h2 className="tip-heading">No Item found:</h2>
          <p className="tip-text">Please try again</p>
        </div>
      );
    }

    if (results) {
      return results.map((result) => <ItemCard key={result.key} item={result} />);
    }

    // Initial View
    return (
      <div className="tip">
        <h2 className="tip-heading">Tip:</h2>
        <p className="tip-text">Press enter after typing</p>
      </div>
    );
  };

  /**
   * useEffect.
   *
   * It should clear the results if the User clear search
   */
  useEffect(() => {
    if (query) return;

    if (query === '') {
      setResults(null);
    }
  }, [query]);

  return (
    <Layout title="Search">
      <div className="search">
        <div className="grid">
          <input
            className="search__input"
            type="search"
            placeholder="Search here"
            onChange={handleSearch}
            value={query}
            onKeyPress={searchItem}
          />
          <div className="search-results">
            {renderResults()}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default useProtection(Search);
