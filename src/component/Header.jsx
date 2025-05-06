import "../App.scss"
import logo from "../assets/logo.png"
export default function Header()
{
    return(
        <div className="header">
            <img className="h-logo" src={logo}></img>
        </div>
    );
}

