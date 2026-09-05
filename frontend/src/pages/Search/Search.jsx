import React, { useContext, useState } from 'react';
import './Search.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../../components/FoodItem/FoodItem';
import { menu_list } from '../../assets/assets';

const Search = () => {
    const { food_list = [] } = useContext(StoreContext);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useState("All");

    const categories = ["All", ...menu_list.map(item => item.menu_name)];

    const filteredFoods = food_list.filter((item) => {
        const matchesCategory = category === "All" || item.category === category;
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
            !query ||
            item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query);

        return matchesCategory && matchesQuery;
    });

    return (
        <div className='search-page'>
            <div className="search-header">
                <h2>Search Dishes & Cuisine</h2>
                <div className="search-bar-container">
                    <input
                        type="text"
                        placeholder="Search by food name, ingredient, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    {searchQuery && (
                        <button className="clear-btn" onClick={() => setSearchQuery("")}>
                            ✕
                        </button>
                    )}
                </div>
            </div>

            <div className="search-categories">
                {categories.map((cat, index) => (
                    <button
                        key={index}
                        className={`category-pill ${category === cat ? "active" : ""}`}
                        onClick={() => setCategory(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="search-results-info">
                <p>
                    Showing {filteredFoods.length} result{filteredFoods.length !== 1 ? 's' : ''}
                    {searchQuery ? ` for "${searchQuery}"` : ''}
                </p>
            </div>

            {filteredFoods.length === 0 ? (
                <div className="search-empty">
                    <h3>No dishes found</h3>
                    <p>Try searching for something else or clear filters.</p>
                    <button onClick={() => { setSearchQuery(""); setCategory("All"); }}>
                        Reset Search Filters
                    </button>
                </div>
            ) : (
                <div className="search-food-grid">
                    {filteredFoods.map((item) => (
                        <FoodItem
                            key={item._id}
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
