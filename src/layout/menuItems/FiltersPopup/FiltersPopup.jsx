import React from "react";
import { Sliders } from "lucide-react";
import styles from "./FiltersPopup.module.css";

export default function FiltersPopup({
  filtersOpen,
  toggleFilters,
  roleFilter,
  setRoleFilter,
  searchText,
  setSearchText,
  sortOrder,
  setSortOrder,
}) {
  return (
    <div>
        <div className={styles.filterIcon} onClick={toggleFilters}>
            <Sliders size={24} />
        </div>

      {filtersOpen && (
        <div className={styles.filtersPopup}>
          <h4>Фильтры</h4>

          <div className={styles.filterGroup}>
            <label>
              <input
                type="radio"
                name="roleFilter"
                value="ALL"
                checked={roleFilter === "ALL"}
                onChange={() => setRoleFilter("ALL")}
              />
              Все
            </label>
            <label>
              <input
                type="radio"
                name="roleFilter"
                value="ORGANIZER"
                checked={roleFilter === "ORGANIZER"}
                onChange={() => setRoleFilter("ORGANIZER")}
              />
              Организатор
            </label>
            <label>
              <input
                type="radio"
                name="roleFilter"
                value="PARTICIPANT"
                checked={roleFilter === "PARTICIPANT"}
                onChange={() => setRoleFilter("PARTICIPANT")}
              />
              Участник
            </label>
          </div>

          <div className={styles.filterGroup}>
            <label>
              Поиск:
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Название или описание"
              />
            </label>
          </div>

          <div className={styles.filterGroup}>
            <label>
              Сортировка по дате:
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="asc">По возрастанию</option>
                <option value="desc">По убыванию</option>
              </select>
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
