"use client"

import { FUNCTIONS_CONFIG_MANIFEST } from 'next/dist/shared/lib/constants';
import './shopPage.css'
import {useState, useCallback, useEffect, act, useLocalStorage, useRef} from "react";

export default function ShopPage({setCartItems, activeFilterNav, itemListMaster, filtersListMaster, filterLoad, cartItems, setPage, setCurrentItemID}) {
    const[itemListActive, setItemListActive] = useState(itemListMaster);
    
    const[activeFilters, setActiveFilters] = useState({});

    const [pageTitle, setPageTitle] = useState("Shop All");

    
    useEffect(() => {
        window.scrollTo(0, 0)

        if (filterLoad){
            const activeFilterDict = {};
            
            filtersListMaster.forEach(function (dict, index) {
                dict['filters'].forEach(function (filter, index){
                    activeFilterDict[filter] = false;
                    // console.log(1)
                });
            });

            if (activeFilterNav !=0){
                activeFilterDict[activeFilterNav] = true;
                setPageTitle(activeFilterNav)
            }
            
            setActiveFilters(activeFilterDict);
        }
    }, [])

    useEffect(() => {


        if (filterLoad){
            for (let key of Object.keys(activeFilters)) {
                document.getElementById(key).checked = false;
                setActiveFilters(activeFilters => ({...activeFilters, [key]: false}))
            }

            if (activeFilterNav !=0) {
                document.getElementById(activeFilterNav).checked = true;
                setActiveFilters(activeFilters => ({...activeFilters, [activeFilterNav]: true}))
                setPageTitle(activeFilterNav)

            }
            else{
                setPageTitle("Shop All")
            }
        };

        

    }, [activeFilterNav, filterLoad])


    useEffect(() => {

        setItemListActive(FilterItems(itemListMaster, activeFilters));
    }, [activeFilters])

    


    // console.log(activeFilters)
    function ClearAll(){
        document.querySelectorAll('input[type=checkbox]').forEach( el => el.checked = false);

        for (let key of Object.keys(activeFilters)) {
            setActiveFilters(activeFilters => ({...activeFilters, [key]: false}))
        }
        
    }

    function SortItems(sortType){
        const sortedItems = [...itemListActive].sort((a, b) => {
            if (sortType === "Price: Low to High") {
                return a.price - b.price;
            } else if (sortType === "Price: High to Low") {
                return b.price - a.price;
            } else {
                return itemListActive;
            }
        });

        setItemListActive(sortedItems);
    }


    return(
        <div id="shopPage">

            <h1>{pageTitle}</h1>
            <select id='sort_select' onChange = {(e) => SortItems(document.getElementById('sort_select').value)}>
                <option>Sort By</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
            </select>
            
            
            <div id="shopBody">
                <div id='filters_body'> 
                    <div id='filters_body_labels'>
                        <svg id='filter_icon' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <g clipPath="url(#clip0_105_941)">
                                <path d="M14.078 23.4579C13.814 23.4583 13.5549 23.3864 13.3289 23.25L8.47112 20.3354C8.25522 20.206 8.07651 20.0229 7.95239 19.804C7.82827 19.585 7.76297 19.3376 7.76285 19.0859V14.0679L1.96656 6.97551C1.31392 6.22684 0.956735 5.26584 0.961971 4.27265C0.963256 3.17716 1.39901 2.12691 2.17363 1.35229C2.94826 0.57766 3.99851 0.141911 5.09399 0.140625L18.2041 0.140625C19.0006 0.140915 19.7801 0.37135 20.4487 0.804204C21.1173 1.23706 21.6466 1.85389 21.9729 2.58048C22.2992 3.30708 22.4086 4.11248 22.2879 4.89978C22.1673 5.68709 21.8217 6.42275 21.2927 7.01826L15.5353 14.1135V22.0006C15.5353 22.3871 15.3817 22.7578 15.1084 23.0311C14.8351 23.3044 14.4645 23.4579 14.078 23.4579ZM10.6775 18.2601L12.6206 19.426V13.5967C12.6204 13.262 12.7353 12.9375 12.9461 12.6776L19.0717 5.1315C19.2923 4.89944 19.4172 4.59275 19.4215 4.27265C19.421 3.94994 19.2926 3.6406 19.0644 3.41241C18.8362 3.18422 18.5269 3.0558 18.2041 3.05529H5.09399C4.85935 3.05552 4.62976 3.12351 4.43283 3.25107C4.23589 3.37864 4.07998 3.56037 3.98384 3.77441C3.88769 3.98845 3.8554 4.22571 3.89085 4.45766C3.92629 4.68961 4.02796 4.90639 4.18365 5.08195L10.3491 12.6261C10.5616 12.8864 10.6776 13.2121 10.6775 13.5481V18.2601Z" fill="#383838"/>
                            </g>
                        </svg>
                            <div>Filter</div>
                            <button id='clear_all' onClick={(e) => ClearAll()}>Clear all</button>
                    </div>
                    <div className='filter'>
                    {filtersListMaster.map((filter_list)=>(
                        <FiltersBuckets key={filter_list.id} name={filter_list.name} activeFilters = {activeFilters} filter_list={filter_list.filters} setActiveFilters={setActiveFilters}/>
                    ))}
                    </div>
                </div>
                <ItemList item_list_data={itemListActive} setCartItems={setCartItems} cartItems={cartItems} itemListMaster={itemListMaster} setPage={setPage} setCurrentItemID={setCurrentItemID}/>
            </div>
        </div>
    );
};


// ITEM FUNCTIONS

function ItemList({item_list_data, setCartItems, cartItems, itemListMaster, setPage, setCurrentItemID}) {
    return(
        <div id="item_list">
            {item_list_data.map((item_dict)=>(
                <Item key={item_dict.id} id={item_dict.id} title={item_dict.title} price={item_dict.price} name={item_dict.name} setCartItems={setCartItems} cartItems={cartItems} itemListMaster={itemListMaster} setPage={setPage} setCurrentItemID={setCurrentItemID}/>
            ))}
        </div>

    );
};

// public\item_images\butterfly\butterfly1.jpg

function Item({id,title,price,name,setCartItems, cartItems, itemListMaster, setPage, setCurrentItemID}) {
    const imagePath = `/item_images/${name}/${name}1.jpg`;

    return(
        <div className='item'>
            <div className="item_img_body">
                <img className="item_img" src={imagePath} onClick={()=> SetItemPage({id, itemListMaster, setPage, setCurrentItemID})}/>
            </div>
            <div className='item_details'>
                <div className = "item_title" onClick={()=> SetItemPage({id, itemListMaster, setPage, setCurrentItemID})}>{title}</div>
                <div className= 'item_price'>${price[0]}</div>
            </div>
            <button className='cart_button' onClick={() => cleanCartItems({setCartItems, cartItems, id, itemListMaster})}>Add to cart</button>
        </div>
    );
};

function SetItemPage({id, itemListMaster, setPage, setCurrentItemID}) {
    setPage("item");
    setCurrentItemID(id);
}

function cleanCartItems({setCartItems, cartItems, id, itemListMaster}) {
    let itemDict = {}

    for (let dict of itemListMaster){
        if (dict['id'] == id) {
            itemDict = dict
        }
    }

    setCartItems((cartItemInfo) => ([...cartItemInfo, 
        {"id":itemDict["id"], "title":itemDict["title"], "name":itemDict["name"], "price":itemDict["price"][0], "colors":itemDict["colors"][0], "size":itemDict["size"][0], "count":1}
    ]))
};




// FILTER FUNCTIONS

function FiltersBuckets({name,filter_list,activeFilters,setActiveFilters}) {
    return(
        <div>
            <div className='filter_name'>{name}</div>
            <div className='filter_bucket'>
                {filter_list.map((filter, index)=>(
                        <Filter key={index} filter={filter} activeFilters = {activeFilters} setActiveFilters={setActiveFilters}/>
                    ))}
            </div>
        </div>
    );
};

function Filter({filter, activeFilters, setActiveFilters}) {


    return(
        <div className="filter_checkbox_label">
            <label>
                <input className='filter_checkbox' id={filter} type='checkbox' onChange = {(e) => setActiveFilters(activeFilters => ({...activeFilters, [filter]: e.target.checked}))}/>
                {filter}
            </label>
        </div>
    );
};

function FilterItems(itemList, activeFilters) {
    // console.log(activeFilters);

    let activeItems = [];

    if (Object.values(activeFilters).some(filter => filter == true)){
        for (let filterName in activeFilters) {

            if (activeFilters[filterName]){
                for (let item of itemList){
                    if (!filterName.includes("$")){
                        let itemFiltersList = [].concat.apply([], Object.values(item['filters']));

                        if (itemFiltersList.includes(filterName)){
                            activeItems.push(item);
                        }
                    }
                    else{
                        let prices = filterName.match(/\d+/g);

                        for (let index=0; index < prices.length; index++){
                            prices[index] = parseInt(prices[index])
                        }

                        if (prices.length ==1){
                            if (filterName.includes("Under")){
                                prices = [0, parseInt(prices[0])]
                            }
                            if (filterName.includes("Over")){
                                prices.push(9999999)
                            }
                        }

                        // console.log(item['price'])
                        
                        if (prices[0]<=item ["price"] && item["price"]<=prices[1]){
                            // console.log(item['price'])
                            activeItems.push(item)
                        }

                        
                    }
                }
            }
        }
    }
    else{
        activeItems = itemList;
    }

    // console.log(activeItems);

    return(activeItems);
};
