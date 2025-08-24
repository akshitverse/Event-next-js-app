import '../styles/globals.css'
import NavBar from '../components/NavBar'

export default function MyApp({ Component, pageProps }) {
  return (
    <div>
      <NavBar />
      <Component {...pageProps} />
    </div>
  )
}
