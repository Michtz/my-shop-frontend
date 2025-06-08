import React from 'react';
import { useAdminProducts } from '@/hooks/AdminContentProductProvider';
import MaterialIcon from '@/app/components/system/MaterialIcon';
import style from '@/styles/AdminProductFilters.module.scss';

const AdminProductFilters: React.FC = () => {
  const { filters, setFilters, getCategories, getFilteredProducts, products } =
    useAdminProducts();
  const categories = getCategories();
  const filteredCount = getFilteredProducts().length;

  const handleSearchChange = (value: string) => {
    setFilters({ search: value });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      isActive: 'all',
      stockLevel: 'all',
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.isActive !== 'all' ||
    filters.stockLevel !== 'all';

  return (
    <div className={style.filtersContainer}>
      <div className={style.searchBar}>
        <div className={style.searchInput}>
          <MaterialIcon icon="search" iconSize="small" />
          <input
            type="text"
            placeholder="Produkte durchsuchen..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {filters.search && (
            <button
              className={style.clearSearch}
              onClick={() => handleSearchChange('')}
            >
              <MaterialIcon icon="close" iconSize="small" />
            </button>
          )}
        </div>
      </div>

      <div className={style.filterRow}>
        <div className={style.filterGroup}>
          <label>Kategorie:</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">Alle Kategorien</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className={style.filterGroup}>
          <label>Status:</label>
          <select
            value={filters.isActive}
            onChange={(e) => handleFilterChange('isActive', e.target.value)}
          >
            <option value="all">Alle Status</option>
            <option value="true">Aktiv</option>
            <option value="false">Inaktiv</option>
          </select>
        </div>

        <div className={style.filterGroup}>
          <label>Lagerbestand:</label>
          <select
            value={filters.stockLevel}
            onChange={(e) => handleFilterChange('stockLevel', e.target.value)}
          >
            <option value="all">Alle Bestände</option>
            <option value="low">Niedrig (≤ 10)</option>
            <option value="out">Nicht verfügbar (0)</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button className={style.clearFilters} onClick={clearFilters}>
            <MaterialIcon icon="filter_list_off" iconSize="small" />
            Filter zurücksetzen
          </button>
        )}
      </div>

      <div className={style.resultsInfo}>
        <span className={style.resultsCount}>
          {filteredCount} von {products.length} Produkten
        </span>

        {hasActiveFilters && (
          <span className={style.filterStatus}>
            <MaterialIcon icon="filter_list" iconSize="small" />
            Filter aktiv
          </span>
        )}
      </div>
    </div>
  );
};

export default AdminProductFilters;
