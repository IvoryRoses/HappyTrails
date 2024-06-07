import Elvira from "../LocationImage/Elvira.jpg";
import Candelaria from "../LocationImage/Candelaria.jpg";
import Sebastian from "../LocationImage/sebastian.jpg";
import Jobap from "../LocationImage/Jobap.jpg";
import Mulawin from "../LocationImage/Mulawin.jpg";
import JacintoBurial from "../LocationImage/JacintoBurial.jpg";
import Imacon from "../LocationImage/ImmaculateConception.jpg";
import Maimpis from "../LocationImage/Maimpis.jpg";
import Gregory from "../LocationImage/SanGregorio.jpg";
import Capricho from "../LocationImage/Puente del Capricho.jpg";
import Joser from "../LocationImage/Jose Rizal Monument.jpg";
import Santiago from "../LocationImage/The Roman Catholic Parish of San Santiago Apostol.jpg";
import Tricross from "../LocationImage/Three Crosses of Paete.jpg";
import Guadalupe from "../LocationImage/Diocesan Shrine and Parish of Our Lady of Guadalupe.jpg";
import Alcantara from "../LocationImage/Saint Peter of Alcantara Parish Church.jpg";
import Natividad from "../LocationImage/Nuestra Senora dela Natividad Parish.jpg";
import Santonio from "../LocationImage/National Shrine and Parish of San Antonio.jpg";
import Rollingcarb from "../LocationImage/RollingCarbs.jpg";
import Bookhive from "../LocationImage/Book Hive Cafe.jpg";
import Muni from "../LocationImage/Muni Coffee PH.jpg";
import Joy from "../LocationImage/Joy_s View.jpg";
import Bro101 from "../LocationImage/BROTHERS CAFE 101.jpg";
import Brics from "../LocationImage/Brics Hideout Restobar.jpg";
import Maribella from "../LocationImage/Maribella Restaurant and Garden Resort.jpg";
import NGTapsi from "../LocationImage/Hulugan Falls Nanay Ganda_s Tapsilogan.jpg";
import Yhamshe from "../LocationImage/YHAMSHE GRILL.jpg";
import Janna from "../LocationImage/Janna_s Place Restaurant.jpg";
import Kotap from "../LocationImage/Miguel_s Garden Cafe at Kota Paradiso.jpg";
import Virgie from "../LocationImage/Nanay Virgie Eatery.jpg";
import Bigboss from "../LocationImage/Big Boss Boodlefight.jpg";
import Kusinaisa from "../LocationImage/Kusina ni Isa.jpg";
import Kusinamoto from "../LocationImage/Kusina mo_to.jpg";
import Ateganda from "../LocationImage/Ate Ganda_s Kainan Lugaw Mami and more.jpg";
import Kesada from "../LocationImage/Kape Kesada.jpg";
import Adors from "../LocationImage/Reese & Kyle_s Lomi&Goto by Adors.jpg";
import Lemaison from "../LocationImage/Le Maison Yelo Lane.jpg";
import Callearco from "../LocationImage/Calle Arco Restaurant.jpg";
import Albertos from "../LocationImage/Alberto_s Heritage Cafe.jpg";
import Fatty from "../LocationImage/Fatty With Double Chin.jpg";
import Casaverde from "../LocationImage/Casa Verde Pagsanjan.jpg";
import Alvin from "../LocationImage/Alvin_s Cuisine.jpg";
import Manay from "../LocationImage/Manay_s Eatery.jpg";
import Portside from "../LocationImage/PORTSIDE UNLIWINGS.jpg";
import Bossprince from "../LocationImage/BOSS Prince Eatery.jpg";
import Foodclock from "../LocationImage/Food O_Clock.jpg";
import Padyok from "../LocationImage/Padyok Cafe and Restaurant.jpg";
import Emeterio from "../LocationImage/Café Emeterio.jpg";
import Alaetonio from "../LocationImage/Ala eh TONIO_s Burger.jpg";
import Liliosa from "../LocationImage/Liliosa Garden Cafe.jpg";
import Korner from "../LocationImage/Tea korner.jpg";
import Jess from "../LocationImage/Jess Gotohan.jpg";
//import Km107 from "../LocationImage/KM107.jpg";
import Naz from "../LocationImage/Naz Coffee.jpg";
import Brickoven from "../LocationImage/The Brickoven Café.jpg";
//import GCafe from "../LocationImage/glorious.jpeg";
//import Aram from "../LocationImage/Aramielle.jpg";
import Handb from "../LocationImage/Herbs And Beans.jpg";
import Norma from "../LocationImage/Cafe Norma.jpg";
import Konstrak from "../LocationImage/Konstrak coffee.jpg";
import Speranza from "../LocationImage/Speranza Plus (ThebeanLab and Kaye's tea).jpg";
import Leona from "../LocationImage/Leona's Kitchen.jpg";
import Lunahills from "../LocationImage/Luna Hills Cafe Resort.jpg";
import Babi from "../LocationImage/Babi Bear Samgyupsal.jpg";
import Edong from "../LocationImage/Halo-halo ni Edong.jpg";
import Kathr from "../LocationImage/Kath Reever.jpg";
//import Ivan from "../LocationImage/ivan.jpeg";
//import Kukuruu from "../LocationImage/Kukuru.jpg";
import Caleb from "../LocationImage/Caleb_s Kitchen.jpg";
import Bossramen from "../LocationImage/Boss D Ramen.jpg";
import Dashe from "../LocationImage/Dash Espresso.jpg";
import Secretb from "../LocationImage/Secret Brew.jpg";

const markerImages = {
  //SAMPLE--------------------------------------------------------------------------
  //Historical----------------------------------------------------------------------
  "Nuestra Señora De La Candelaria Parish": Candelaria,
  "San Sebastian Parish Church": Sebastian,
  "Saint John the Baptist Parish": Jobap,
  "Cathedral of Our Lady of Maulawin": Mulawin,
  "Emilio Jacinto Burial Place and Monument": JacintoBurial,
  "Immaculate Conception Parish Church": Imacon,
  "Labanan sa Maimpis": Maimpis,
  "St. Gregory the Great Parish Church": Gregory,
  "Puente del Capricho": Capricho,
  "Jose Rizal Monument": Joser,
  "The Roman Catholic Parish of San Santiago Apostol": Santiago,
  "Three Crosses of Paete": Tricross,
  "Diocesan Shrine and Parish of Our Lady of Guadalupe": Guadalupe,
  "Saint Peter of Alcantara Parish Church": Alcantara,
  "Nuestra Senora dela Natividad Parish": Natividad,
  "National Shrine and Parish of San Antonio": Santonio,
  //FOOD------------------------------------------------------------------------------
  "Papa's All Day Breakfast, Ramen by Rolling Carbs, Gracias Bake shop":
    Rollingcarb,
  "Book Hive Cafe": Bookhive,
  "Muni Coffee PH": Muni,
  "Joy's View": Joy,
  "BROTHERS CAFE 101": Bro101,
  "Brics Hideout Restobar": Brics,
  "Maribella Restaurant and Garden Resort": Maribella,
  "Hulugan Falls Nanay Ganda's Tapsilogan": NGTapsi,
  "YHAMSHE GRILL": Yhamshe,
  "Janna's Place Restaurant": Janna,
  "Elvira's Creamy Halo-Halo and Pancit Lucban": Elvira,
  "Miguel's Garden Cafe at Kota Paradiso": Kotap,
  "Nanay Virgie Eatery": Virgie,
  "Big Boss Boodlefight": Bigboss,
  "Kusina ni Isa": Kusinaisa,
  "Kusina mo'to": Kusinamoto,
  "Ate Ganda's Kainan Lugaw Mami and more": Ateganda,
  "Kape Kesada": Kesada,
  "Reese & Kyle's Lomi&Goto by Adors": Adors,
  "Le Maison Yelo Lane": Lemaison,
  "Calle Arco Restaurant": Callearco,
  "Alberto's Heritage Cafe": Albertos,
  "Fatty With Double Chin": Fatty,
  "Casa Verde Pagsanjan": Casaverde,
  "Alvin's Cuisine": Alvin,
  "Manay's Eatery": Manay,
  "PORTSIDE UNLIWINGS": Portside,
  "BOSS Prince Eatery": Bossprince,
  "Food O'Clock": Foodclock,
  "Padyok Cafe and Restaurant": Padyok,
  "Café Emeterio": Emeterio,
  "Ala eh TONIO's Burger": Alaetonio,
  "Liliosa Garden Cafe": Liliosa,
  "Tea korner": Korner,
  "Jess Gotohan": Jess,
  //KM107: Km107,
  "Naz Coffee": Naz,
  "The Brickoven Café": Brickoven,
  //"Glorious Café" : GCafe,
  //Aramielle: Aram,
  "Herbs And Beans": Handb,
  "Cafe Norma PH": Norma,
  "Konstrak coffee": Konstrak,
  "Speranza Plus (ThebeanLab and Kaye's tea)": Speranza,
  "Leona's Kitchen": Leona,
  "Luna Hills Cafe Resort": Lunahills,
  "Babi Bear Samgyupsal": Babi,
  "Halo-halo ni Edong": Edong,
  "Kath Reever": Kathr,
  //"Ivann's" : Ivan,
  //Kukuru: Kukuruu,
  "Caleb's Kitchen": Caleb,
  "Boss D Ramen": Bossramen,
  "Dash Espresso": Dashe,
  "SECRET BREW": Secretb,
  //Nature------------------------------------------------------------------------
};

export default markerImages;
