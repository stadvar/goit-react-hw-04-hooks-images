import PropTypes from 'prop-types';
import { useState } from 'react';
import './Searchbar.css';

function Searchbar({ onSubmit }) {
  const [value, setValue] = useState('');
  const handlerSearch = e => {
    setValue(e.currentTarget.value);
  };
  const handlerSubmit = e => {
    e.preventDefault();
    onSubmit(value);
  };
  return (
    <header className="Searchbar">
      <form className="SearchForm" onSubmit={handlerSubmit}>
        <button type="submit" className="SearchForm-button">
          <span className="SearchForm-button-label">Search</span>
        </button>

        <input
          className="SearchForm-input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={value}
          onChange={handlerSearch}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
export default Searchbar;
