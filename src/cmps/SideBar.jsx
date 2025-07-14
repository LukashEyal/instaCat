import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/user.actions'

export function SideBar() {

    return (
        <header className="app-header main-container full">
            <nav className=''>
            <h1>Sidebar</h1>
            </nav>
        </header >
    )
}
