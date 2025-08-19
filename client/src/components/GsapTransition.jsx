import { Routes , Route, useLocation } from "react-router-dom"
import BuyerDashboard from "../pages/BuyerDashboard"
import Home from "../pages/Home"
import Login from "../pages/Login"
import SellerDashboard from "../pages/SellerDashboard"
import Signup from "../pages/Signup"
import gsap from "gsap";
import { useEffect, useRef } from "react"
import ProtectedRoute from "./ProtectedRoute"

const GsapTransition = () => {

    const nodeRef = useRef(null);
    const location = useLocation();
    console.log("The location is: ", location);

    //Jabh bhi location change hoga tab ye useEffect run hoga, because yeh useEffect hook ko dependedent banane wale hai location ke upar.

    //When a page renders, useEffect runs first -> useEffect
    useEffect(() => {
        if(nodeRef.current){
            gsap.fromTo(nodeRef.current, {opacity: 0}, {opacity: 1, duration: 1});
        }
    }, [location]);
    //When we keep dependency array empty, it means that: bhai yeh page call hoga jabhi tum refresh karoge
    // But we want the chnaging thing to happen when useEffect is caleed that's why we passed locatiion in []

    //For GSAP:
    // 1. target
    // 2. logic

  return (
    <div ref = {nodeRef}>
        <Routes location = {location}>      //Routes ke paas hi location hota hai so we pass it here
            <Route path = "/" element = {<Home />} />
            <Route path = "/login" element = {<ProtectedRoute children={<Login />} requiresAuth={false} />} />
            <Route path = "/signup" element = {<ProtectedRoute children={<Signup />} requiresAuth={false} />} />
            <Route path = "/seller/profile" element = {<ProtectedRoute children = {<SellerDashboard />} />} />
            <Route path = "/buyer/profile" element = {<ProtectedRoute children = {<BuyerDashboard />} />} />
        </Routes> 
    </div>
  )
}

export default GsapTransition
