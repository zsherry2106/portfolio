'use client';
import {useState, useCallback, useEffect} from "react";
import './mainPage.css';
import Footer from "../footer/footer.js";
import emailjs from '@emailjs/browser';
// import Video from '/images/Web-Video.mp4'


export default function MainPage({switchPage, setCurrentItemID}) {
    const [formData, setFormData] = useState({
        email: ''
    });
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form Data:', formData);
        //This is where the rest of the newsletter stuff will go once we get it
        if (!validateEmail(formData.email)) {
            let heading = document.getElementById("warning");
            heading.style.display = "block"; // Unhide the heading
            return;

        }
        const serviceID = "service_mobiles";
        const templateID = "template_esfz78x";
        const publicKey = "UJGV8AHTrLnHwBpIs";
        const templateID2="";
    
        emailjs.send(serviceID, templateID, formData, publicKey)
            .then(response => {
                console.log("Email sent successfully!", response.status, response.text);
                switchPage('thanks');
            })
            .catch(error => {
                console.error("Failed to send email:", error);
            });
    
        console.log('Form Data:', formData);
        return;

    };

    return (
        <div id='mainPage'>

            <div id='headingsMP'>
                <h2>Check out our mobiles and stabiles!</h2>
                <h4>Brighten up your space with a colorful centerpiece</h4>
            </div>
            <div id='imgMP'>
                
                <video loop autoPlay muted
                    id='videoMP'
                    src='/images/Web-Video.mp4'
                    // allow='autoplay; encrypted-media'
                    // allowfullscreen
                    // title='videoMP'
                />

                <div id="morep">
                    <button id='moreptext' onClick={()=> switchPage('process')}>More of the process</button>
                    <svg id="moreparrow" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                    <path d="M15.4003 10.3801L10.8103 5.79006C10.6229 5.60381 10.3695 5.49927 10.1053 5.49927C9.8411 5.49927 9.58765 5.60381 9.40029 5.79006C9.30656 5.88302 9.23217 5.99362 9.1814 6.11548C9.13063 6.23734 9.10449 6.36805 9.10449 6.50006C9.10449 6.63207 9.13063 6.76278 9.1814 6.88464C9.23217 7.0065 9.30656 7.1171 9.40029 7.21006L14.0003 11.7901C14.094 11.883 14.1684 11.9936 14.2192 12.1155C14.27 12.2373 14.2961 12.368 14.2961 12.5001C14.2961 12.6321 14.27 12.7628 14.2192 12.8846C14.1684 13.0065 14.094 13.1171 14.0003 13.2101L9.40029 17.7901C9.21199 17.977 9.10567 18.2312 9.10473 18.4965C9.1038 18.7619 9.20831 19.0168 9.39529 19.2051C9.58227 19.3934 9.83639 19.4997 10.1018 19.5006C10.3671 19.5016 10.622 19.397 10.8103 19.2101L15.4003 14.6201C15.9621 14.0576 16.2777 13.2951 16.2777 12.5001C16.2777 11.7051 15.9621 10.9426 15.4003 10.3801Z" fill="#374957"/>
                    </svg>
                </div>
                
                <div id='morsMP'>
                    <div id = "moreMobiles">
                        <img onClick={()=> switchPage('shop')} src="/item_images/suspended-animation/suspended-animation1.jpg" />
                        <div id="moreNameM">Mobiles</div>
                        <div id="moreShopNowM" onClick={()=> switchPage('shop')}>Shop Now 
                        </div>
                    </div>

                    <div id = "moreStabiles">
                        <div id="moreNameS">Stabiles</div>
                        <img onClick={()=> switchPage('shop')} src="/item_images/taking-shape/taking-shape1.jpg" />
                        <div id="moreShopNowS" onClick={()=> switchPage('shop')}>Shop Now
                        </div>
                    </div>
                </div>

                <h4 id="poppiecetitle">Popular Pieces</h4>
                <div id='poppieceMP'>
                    
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
            <div id='shopallMP'>
                <h2> Art that reflects, captivates, and soothes</h2>
                <button id='SAP' onClick={()=> switchPage('shop')}>SHOP ALL PIECES</button>
            </div>
            <div id='newsletterMP'>
                <h3>Newsletter</h3>
                <h6>Stay updated! Keep up on our new pieces, events, and other updates.</h6>
                
                <div id='signupN1'>
                   <div id='signupN'> <input id='signupbox'type="email" name="email" placeholder="Enter your email" value={formData.name}
                    onChange={handleChange}/>
                    <button id='signupbutton' onClick={handleSubmit}>SIGN UP</button>
                    </div>
                    <h2 id='warning'>Please enter a valid email</h2>
                </div>     
                
            </div>
            <div id='contactMP'>
                <img src='https://s3-alpha-sig.figma.com/img/6ab8/a8c2/e77c3a0af2e060742cb7a22350d2a340?Expires=1734912000&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=HI0ZYINMTnNN12xSXvPh3T3pqTUP133cIgD2Lt44Wu6KLHFX8FUc6Bqk3UgTpS4uSRi9rhRXsbsjnoR6IfthyqplDkS8y5WI9yMd-yPSfwhpYR3ymAQwTiNOIlUj8IHNWSIuDNNxRpo9LswGUApS0tQ3x1vG6Trm5DatZsFWk-TVmXzW1enFikaKWt1T4pUPnnFg7soQLwF8GkIarLjg9MOm5c1IdXejuw7vMhn-kKCZwJSvkq1Peu6VHY894qdDbirrmAdrRiB6K~9GJ61xE-i-0spL~Fid-1D6ZiO4Xyx0OPd-cgO1InoddnleR-mSEz33SdLwtoiZeEsuYoOs1Q__' />
                <div id='contact2'>
                    <h5>Works available for residential and commercial spaces!</h5>
                    <h6>Contact us about hanging mobiles in your office, home, or any space you want! We&apos;re always open to collaborate.</h6>
                    <button id='gitC' onClick={()=> switchPage('contact')}>GET IN TOUCH</button>
                </div>
            </div>


        </div>
    )
}