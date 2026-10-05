


import "./error404.css"
import { useNavigate } from "react-router-dom"
import localforage from "localforage"
import Cookie from "js-cookie"
const Error404 = () => {
  const navigate = useNavigate()

  const handleNavigateUser = () => {
    localforage.getItem("user_email").then((feedback) => {
      if (feedback && Cookie.get('gameModeToken')){
          navigate('/game-mode', {replace: true})
      }else if(feedback && Cookie.get('loginToken')){
        navigate('/app/private-route/admin/dashboard', {replace: true})
      }else{
        console.log(true)
        navigate('/', {replace: true})
      }
    })
  }
//     return <div style={{background: "linear-gradient(to left, rgb(0, 0, 99), rgb(3, 3, 75))", position: "relative"}}>
//         {/* <a href="https://codepen.io/uiswarup/full/vYPxywO" target="_blank"> */}
//   <header class="top-header"></header>

// {/* <!--dust particel--> */}
// <div>
//   <div class="starsec"></div>
//   <div class="starthird"></div>
//   <div class="starfourth"></div>
//   <div class="starfifth"></div>
// </div>
// {/* <!--Dust particle end---> */}


// <div class="lamp__wrap">
//   <div class="lamp">
//     <div class="cable"></div>
//     <div class="cover"></div>
//     <div class="in-cover">
//       <div class="bulb"></div>
//     </div>
//     <div class="light"></div>
//   </div>
// </div>
// {/* <!-- END Lamp --> */}
// <section class="error">
//   {/* <!-- Content --> */}
//   <div class="error__content">
//     <div class="error__message message">
//       <h1 class="message__title">Page Not Found</h1>
//       <p class="message__text">We're sorry, the page you were looking for isn't found here. The link you followed may either be broken or no longer exists. Please try again, or take a look at our.</p>
//     </div>
//     <div class="error__nav e-nav">
//       <button class="e-nav__link" onClick={handleNavigateUser}></button>
//     </div>
//   </div>
//   {/* <!-- END Content --> */}

// </section>

//   {/* </a> */}

//     </div>

return <div
className="error-page-container"
style={{
  background: "linear-gradient(to left, rgb(0, 0, 99), rgb(3, 3, 75))",
  position: "relative",
  height: "100%",
  overflow: "hidden",
  padding: 0,
  margin: 0,
}}
>
<header className="top-header"></header>
<div>
  <div className="starsec"></div>
  <div className="starthird"></div>
  <div className="starfourth"></div>
  <div className="starfifth"></div>
</div>
<div className="lamp__wrap">
  <div className="lamp">
    <div className="cable"></div>
    <div className="cover"></div>
    <div className="in-cover">
      <div className="bulb"></div>
    </div>
    <div className="light"></div>
  </div>
</div>
<section className="error">
  <div className="error__content">
    <div className="error__message message">
      <h1 className="message__title">Page Not Found</h1>
      <p className="message__text">
        We're sorry, the page you were looking for isn't found here. The
        link you followed may either be broken or no longer exists.
        Please try again, or take a look at our.
      </p>
    </div>
    <div className="error__nav e-nav">
      <button className="e-nav__link" onClick={handleNavigateUser}></button>
    </div>
  </div>
</section>
</div>

}
export default Error404