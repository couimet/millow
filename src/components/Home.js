import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import close from '../assets/close.svg';

const Home = ({ home, provider, escrow, togglePop }) => {

    const [buyer, setBuyer] = useState(null)
    const [lender, setLender] = useState(null)
    const [inspector, setInspector] = useState(null)
    const [seller, setSeller] = useState(null)
  
    const fetchDetails = async () => {
      // -- Buyer

      const buyer = await escrow.buyer(home.id)
      setBuyer(buyer)

      // -- Seller

      const seller = await escrow.seller()
      setSeller(seller)

      // -- Lender

      const lender = await escrow.lender()
      setLender(lender)

      // -- Inspector

      const inspector = await escrow.inspector()
      setInspector(inspector)
    }

    return (
        <div className="home">
          <div className="home__details">
            <div className="home__image">
              <img src={home.image} alt="Home" />
            </div>
            <div className="home__overview">
              <h1>{home.name}</h1>
              <p>
                <strong>{home.attributes[2].value}</strong> bds |
                <strong>{home.attributes[3].value}</strong> ba |
                <strong>{home.attributes[4].value}</strong> sqft
              </p>
              <p>{home.address}</p>
              <h2>{home.attributes[0].value} ETH</h2>

              <div>
                <button className="home__buy">
                  Buy
                </button>
              </div>
              <button className="home__contact">
                Contact agent
              </button>

              <hr />

              <h2>Overview</h2>
              <p>
                {home.description}
              </p>
              
              <hr />

              <h2>Fact and features</h2>

              <ul>
                {home.attributes.map((attribute, index) => (
                  <li key={index}><strong>{attribute.trait_type}</strong> : {attribute.value}</li>
                ))}
              </ul>
            </div>

            <button onClick={togglePop} className="home__close">
              <img src={close} alt="Close" />
            </button>
          </div>
        </div>
    );
}

export default Home;
