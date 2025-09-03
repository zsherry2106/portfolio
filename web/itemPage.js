'use client';
import './itemPage.css';
import './itemPagePage.css';
import { useState, useEffect, useRef } from "react";
import Care from "./oldPages/care"
import Statement from "./oldPages/statement"
import { useRouter } from 'next/navigation'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"

 

export default function ItemPage({itemListMaster, id, itemLoad, setCartItems, switchPage}){
    const router = useRouter()

    const [page, setPage] = useState("specifications");

    const [itemDict, setItemDict] = useState({});

    const[materials, setMaterials] = useState("")
    const[dimensions, setDimensions] = useState("")

    const [sizeIndex, setSizeIndex] = useState(0);
    const [priceIndex, setPriceIndex] = useState(0);
    const [colorIndex, setColorIndex] = useState(0); 

    const [numPhotos, setNumPhotos] = useState(0);

    // console.log("NumPhotos: "+numPhotos)
    

    useEffect(()=>{
        window.scrollTo(0, 0)
    },[])

    useEffect(()=>{
        setMaterials(itemDict['extra']['materials'])


        if (itemDict['extra']['dimensions'].length > 1){
            setDimensions(itemDict['extra']['dimensions'])
        }
        else{
            setDimensions("Coming Soon")
        }

        let name = itemDict.name
        GetPhotos({name, setNumPhotos})

    }, [itemDict])

    useEffect(() => {
        setPriceIndex(sizeIndex)
    }, [sizeIndex])


    if (itemLoad && Object.keys(itemDict).length==0) {
        // console.log('test')
        for (let dict of itemListMaster){
            if (dict.id ==id){
                setItemDict(dict)
                
                
            }
        };
    }


    if (router.isFallback) {
        return <div>Loading...</div>
      }

    return(
        <div>
            <ItemPageTop switchPage={switchPage} itemDict = {itemDict} setCartItems={setCartItems} id={id} itemListMaster={itemListMaster} priceIndex={priceIndex} setColorIndex={setColorIndex} setSizeIndex={setSizeIndex} colorIndex={colorIndex} sizeIndex={sizeIndex} numPhotos={numPhotos}/>
            <Specifications dimensions = {dimensions} materials = {materials}/>
            <ItemPageBottom />
        </div>
        
    )

}


function ItemPageTop({switchPage, itemDict, setCartItems, id, itemListMaster, setColorIndex, setSizeIndex, priceIndex, colorIndex, sizeIndex, numPhotos}){    
    
    return(
        <div id='itemPage'>
            <div id="itemDesc">
                <div id="hometext" onClick = {()=> switchPage('main')}>Home</div>
                <div> / </div>
                <div id="shoptext" onClick = {()=> switchPage('shop')}>Shop All</div>
                <div> / </div>
                <div>{itemDict.title}</div>
            </div>

            <div id ='topDiv'>

                <div id='info'>
                    <div id='titleDiv'>
                        <h1 id='pName'>{itemDict.title}</h1>
                        <div id='itemPrice'>
                            <div id='cost'>${itemDict.price[priceIndex]}</div>
                        </div>
                    </div>

                    <hr></hr>

                    <div id="itemSelects">
                        <div id="itemdropdown">
                            <h2>Color:</h2>
                            <Select itemDict={itemDict} type="colors" setColorIndex={setColorIndex} setSizeIndex={setSizeIndex}/>
                        </div>

                        <div id="itemdropdown">
                            <h2>Size:</h2>
                            <Select itemDict={itemDict} type="size" setColorIndex={setColorIndex} setSizeIndex={setSizeIndex}/>
                        </div>
                    </div>

                    <div id='descDiv'>
                        <button id='addcart' onClick={() => cleanCartItems({setCartItems, id, itemListMaster, priceIndex, colorIndex, sizeIndex})} >Add to cart</button>
                    </div>

                </div>

                <Images numPhotos = {numPhotos} name={itemDict.name}/>

            </div>

            <div id='botDiv'>
                <div id='detailsDiv'>
                    {/* <a href="#my-section" onClick={()=> switchPage('care')}>Maintenance and Care</a> */}
                    <a href="#my-section" >Specifications</a>
                    {/* <a href="#my-section" onClick={()=> switchPage('statement')}>Artist Statement</a> */}
                </div>
            </div>

            <div id="itembr"></div>

        </div>

    )
}

function Images({numPhotos, name}){
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);

    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow to="next"/>,
        prevArrow: <SamplePrevArrow to="prev" />,
        afterChange: index => setCurrentIndex(index),
      };

    if (numPhotos ==1){
        return(
            <div id='images'>
                <img id="bigImage" src={`/item_images/${name}/${name}1.jpg`}/>
            </div>
        )

    }
    
    else{
        return(
            <div id='images'>
                <div className="slider-container" id="bigImage">
                    <Slider ref={sliderRef} {...settings}>
                        {Array.from({length: numPhotos}, (_, i)=> (
                            <div key={i}>
                                <img id="test" key={i} src={`/item_images/${name}/${name}${i+1}.jpg`}/>
                            </div>
                        ))}
                    </Slider>
                </div>

                <div id='smallImages'>
                    {numPhotos > 1 &&
                        Array.from({ length: numPhotos }, (_, i) => (
                        <img id='smallImage' onClick={() => sliderRef.current.slickGoTo(i)} key={i} src={`/item_images/${name}/${name}${i+1}.jpg`}></img>
                        ))}
                </div>                    
            </div>
        )
    }

}

const SamplePrevArrow = (props) => {
      const { className, style, onClick } = props;
      return(
        <div onClick={onClick} className={`arrow ${className}`} >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z"/></svg>

        </div>
      )
      }

 function SampleNextArrow(props) {
      const { className, style, onClick } = props;
      return(
        <div onClick={onClick} className={`arrow ${className}`} >
          <svg xmlns="http://www.w3.org/2000/svg" transform="scale(-1, 1)" width="24" height="24"><path d="M15.293 3.293 6.586 12l8.707 8.707 1.414-1.414L9.414 12l7.293-7.293-1.414-1.414z"/></svg>
        </div>
      )
    }


function Select({itemDict, type, setColorIndex, setSizeIndex}){
    if (itemDict[type].length == 1 ){
        return(
            <div id="itemdetail">{itemDict[type][0]}</div>
        )
    }

    else if (itemDict[type].length==0 && type=="size"){
        return(
            <div id="itemdetail">Medium</div>
        )
    }

    const id = type==="size"? "sizeselect": "colorselect";

    return(
        <select className="itemselect" id={id} onChange = {(e) => setSelect({type, setColorIndex, setSizeIndex})}>
            {itemDict[type].map((name, index) => (
                <option key={index} value={name}>
                {name}
                </option>
            ))}
        </select>
    )
}

function setSelect({type, setColorIndex, setSizeIndex}) {
    // console.log('test')
    if (type=='colors'){
        // console.log(document.getElementById('colorselect'))
        setColorIndex(document.getElementById('colorselect').selectedIndex)
        // setColorIndex()
    }

    else{
        console.log(type)
        // console.log(document.getElementById("sizeselect"))
        setSizeIndex(document.getElementById("sizeselect").selectedIndex)
    }
    // document.getElementById('sort_select').value
}

function Specifications({dimensions, materials}) {
    return(
        <div id="itemPage">
            <div id="specBox">
                <div id="specPart">
                    <svg id="specIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <g clipPath="url(#clip0_120_974)">
                        <path d="M7 0C6.73478 0 6.48043 0.105357 6.29289 0.292893C6.10536 0.48043 6 0.734784 6 1V3C6 3.79565 5.68393 4.55871 5.12132 5.12132C4.55871 5.68393 3.79565 6 3 6H1C0.734784 6 0.48043 6.10536 0.292893 6.29289C0.105357 6.48043 0 6.73478 0 7C0 7.26522 0.105357 7.51957 0.292893 7.70711C0.48043 7.89464 0.734784 8 1 8H3C4.32559 7.99841 5.59644 7.47112 6.53378 6.53378C7.47112 5.59644 7.99841 4.32559 8 3V1C8 0.734784 7.89464 0.48043 7.70711 0.292893C7.51957 0.105357 7.26522 0 7 0V0Z" fill="#374957"/>
                        <path d="M23 16H21C19.6744 16.0016 18.4036 16.5289 17.4662 17.4662C16.5289 18.4036 16.0016 19.6744 16 21V23C16 23.2652 16.1054 23.5196 16.2929 23.7071C16.4804 23.8946 16.7348 24 17 24C17.2652 24 17.5196 23.8946 17.7071 23.7071C17.8946 23.5196 18 23.2652 18 23V21C18 20.2043 18.3161 19.4413 18.8787 18.8787C19.4413 18.3161 20.2043 18 21 18H23C23.2652 18 23.5196 17.8946 23.7071 17.7071C23.8946 17.5196 24 17.2652 24 17C24 16.7348 23.8946 16.4804 23.7071 16.2929C23.5196 16.1054 23.2652 16 23 16Z" fill="#374957"/>
                        <path d="M21 8H23C23.2652 8 23.5196 7.89464 23.7071 7.70711C23.8946 7.51957 24 7.26522 24 7C24 6.73478 23.8946 6.48043 23.7071 6.29289C23.5196 6.10536 23.2652 6 23 6H21C20.2043 6 19.4413 5.68393 18.8787 5.12132C18.3161 4.55871 18 3.79565 18 3V1C18 0.734784 17.8946 0.48043 17.7071 0.292893C17.5196 0.105357 17.2652 0 17 0C16.7348 0 16.4804 0.105357 16.2929 0.292893C16.1054 0.48043 16 0.734784 16 1V3C16.0016 4.32559 16.5289 5.59644 17.4662 6.53378C18.4036 7.47112 19.6744 7.99841 21 8Z" fill="#374957"/>
                        <path d="M3 16H1C0.734784 16 0.48043 16.1054 0.292893 16.2929C0.105357 16.4804 0 16.7348 0 17C0 17.2652 0.105357 17.5196 0.292893 17.7071C0.48043 17.8946 0.734784 18 1 18H3C3.79565 18 4.55871 18.3161 5.12132 18.8787C5.68393 19.4413 6 20.2043 6 21V23C6 23.2652 6.10536 23.5196 6.29289 23.7071C6.48043 23.8946 6.73478 24 7 24C7.26522 24 7.51957 23.8946 7.70711 23.7071C7.89464 23.5196 8 23.2652 8 23V21C7.99841 19.6744 7.47112 18.4036 6.53378 17.4662C5.59644 16.5289 4.32559 16.0016 3 16Z" fill="#374957"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_120_974">
                        <rect width="24" height="24" fill="white"/>
                        </clipPath>
                    </defs>
                    </svg>

                    <div id="specTitle">Dimensions</div>
                    <div id="specDetail">{dimensions}</div>
                </div>

                <div id="specBr"></div>


                <div id="specBr"></div>

                <div id="specPart">
                    <svg id="specIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <g clipPath="url(#clip0_122_990)">
                        <path d="M9 14H15C15.2652 14 15.5196 13.8947 15.7071 13.7071C15.8946 13.5196 16 13.2652 16 13C16 12.7348 15.8946 12.4804 15.7071 12.2929C15.5196 12.1054 15.2652 12 15 12H9C8.73478 12 8.48043 12.1054 8.29289 12.2929C8.10536 12.4804 8 12.7348 8 13C8 13.2652 8.10536 13.5196 8.29289 13.7071C8.48043 13.8947 8.73478 14 9 14Z" fill="#374957"/>
                        <path d="M19 0H5C3.67441 0.00158786 2.40356 0.528882 1.46622 1.46622C0.528882 2.40356 0.00158786 3.67441 0 5L0 6C0.000290807 6.42174 0.0895008 6.83868 0.261809 7.22362C0.434117 7.60856 0.685652 7.95284 1 8.234V19C1.00159 20.3256 1.52888 21.5964 2.46622 22.5338C3.40356 23.4711 4.67441 23.9984 6 24H18C19.3256 23.9984 20.5964 23.4711 21.5338 22.5338C22.4711 21.5964 22.9984 20.3256 23 19V8.234C23.3143 7.95284 23.5659 7.60856 23.7382 7.22362C23.9105 6.83868 23.9997 6.42174 24 6V5C23.9984 3.67441 23.4711 2.40356 22.5338 1.46622C21.5964 0.528882 20.3256 0.00158786 19 0V0ZM2 5C2 4.20435 2.31607 3.44129 2.87868 2.87868C3.44129 2.31607 4.20435 2 5 2H19C19.7956 2 20.5587 2.31607 21.1213 2.87868C21.6839 3.44129 22 4.20435 22 5V6C22 6.26522 21.8946 6.51957 21.7071 6.70711C21.5196 6.89464 21.2652 7 21 7H3C2.73478 7 2.48043 6.89464 2.29289 6.70711C2.10536 6.51957 2 6.26522 2 6V5ZM21 19C21 19.7956 20.6839 20.5587 20.1213 21.1213C19.5587 21.6839 18.7956 22 18 22H6C5.20435 22 4.44129 21.6839 3.87868 21.1213C3.31607 20.5587 3 19.7956 3 19V9H21V19Z" fill="#374957"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_122_990">
                        <rect width="24" height="24" fill="white"/>
                        </clipPath>
                    </defs>
                    </svg>

                    <div id="specTitle">Material</div>
                    <div id="specDetail">{materials}</div>
                </div>
            </div>
        </div>
    )
}

function cleanCartItems({setCartItems, id, itemListMaster, priceIndex, colorIndex, sizeIndex}) {
    let itemDict = {}

    for (let dict of itemListMaster){
        if (dict['id'] == id) {
            itemDict = dict
        }
    }


    setCartItems((cartItemInfo) => ([...cartItemInfo, 
        {"id":itemDict["id"], "title":itemDict["title"], "name":itemDict["name"], "price":itemDict["price"][priceIndex], "colors":itemDict["colors"][colorIndex], "size":itemDict["size"][sizeIndex], "count":1}
    ]))
};


function ItemPageBottom(){
    return(
        <div id='itemPage'>

            <div id='otherItems'>
                <div>Other Items you may like</div>
                <div id="otherItemImg">
                    <div id='popimg'>
                        <img src="/item_images/oh-baby-baby/oh-baby-baby1.jpg" onClick={()=> {switchPage("item"); setCurrentItemID(22)}}/> 
                        <div className="popimgtxt" onClick={()=> {switchPage("item"); setCurrentItemID(22)}}>Oh Baby, Baby</div>
                    </div>
                    <div id='popimg'>
                        <img src="/item_images/going-steady/going-steady1.jpg" onClick={()=> {switchPage("item"); setCurrentItemID(47)}}/> 
                        <div className="popimgtxt" onClick={()=> {switchPage("item"); setCurrentItemID(47)}}>Going Steady</div>
                    </div>
                    <div id='popimg'>
                        <img src="/item_images/celebration/celebration1.jpg" onClick={()=> {switchPage("item"); setCurrentItemID(3)}}/> 
                        <div className="popimgtxt" onClick={()=> {switchPage("item"); setCurrentItemID(3)}}>Celebration</div>
                    </div>
                    <div id='popimg'>
                        <img src="/item_images/elements/elements1.jpg" onClick={()=> {switchPage("item"); setCurrentItemID(46)}}/> 
                        <div className="popimgtxt" onClick={()=> {switchPage("item"); setCurrentItemID(46)}}>Elements</div>
                    </div>
                </div>       
            </div>

            {/* <div id="itembr"></div> */}

            {/* <div id="reviews">
                    <div id="revTitle">Reviews</div>

                    <div id="reviewBox">
                        <div id="revContent">
                            <div id="revStars">* * * * *</div>
                            <div id="revHead">Great for size and colors</div>
                            <div id="revDesc">This peace fit perfectly in the space that I wanted it to and everyone compliments me on it. I would definitely recommend that you choose this piece. </div>
                            <div id="revReact">
                                <div id="revLikeIcon"></div>
                                <div id="revCommentIcon"></div>
                                <div id="revComment">Leave a comment</div>
                            </div>
                        </div>
                    </div>

                    <div id="reviewBox">
                        <div id="revContent">
                            <div id="revStars">* * * * *</div>
                            <div id="revHead">Great for size and colors</div>
                            <div id="revDesc">This peace fit perfectly in the space that I wanted it to and everyone compliments me on it. I would definitely recommend that you choose this piece. </div>
                            <div id="revReact">
                                <div id="revLikeIcon"></div>
                                <div id="revCommentIcon"></div>
                                <div id="revComment">Leave a comment</div>
                            </div>
                        </div>
                    </div>
                </div> */}
        </div>

)}

function GetPhotos({ name, setNumPhotos }) {
    const folderPath = `/item_images/${name}`;

    async function loadData() {
        const url = `/api/itemfiles?path=${encodeURIComponent(folderPath)}`;

        try {
            const res = await fetch(url);
            const data = await res.json();
            // console.log('Files:', data);

            if (Array.isArray(data)) {
                setNumPhotos(data.length);
            } else {
                console.error('Unexpected response:', data);
            }
        } catch (err) {
            console.error('Error fetching files:', err);
        }
    }

    loadData();

    return null;
}