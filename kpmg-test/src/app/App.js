import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import Map from '../components/map/Map';
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faFilter, faCompress, faXmark } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

const App = () => {

  const [ companies, setCompanies ] = useState([]);
  const [ menuFS, setMenuFS ] = useState(false);

  const menuRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    getCompanies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getCompanies = async () => {

      let data = await fetch('http://localhost:3000/companies.json');
      data = await data.json();
      setCompanies(data);

  }

  const toggleMenu = () => {
    if (menuRef.current && mapRef.current) {

      const menuOpen = menuRef.current.classList.contains('open');
      console.log(mapRef.current.classList)

      if (menuOpen) {

        toggleFullscreen(true);
        menuRef.current.classList.remove('open');
        mapRef.current.classList.remove('menu-open');

      } else {

        menuRef.current.classList.add('open');
        mapRef.current.classList.add('menu-open');

      }

    }
  }

  const toggleFullscreen = close => {
    if (menuFS || close) {

      setMenuFS(false);
      menuRef.current.classList.remove('fullscreen');
      mapRef.current.classList.remove('menu-fullscreen');

    } else {

      setMenuFS(true);
      menuRef.current.classList.add('fullscreen');
      mapRef.current.classList.add('menu-fullscreen');

    }
  }

  return (
    <div id="app">

      <Map
        companies={ companies }
        handleToggleMenu={ toggleMenu }
        mapRef={ mapRef }
      />

      <div id='menu' ref={ menuRef }>

        <header id="menu-header">

          <div className='left'>

            <Dropdown>

              <Dropdown.Toggle className="border" size="sm" variant="light">
                <FontAwesomeIcon icon={ faFilter }/>
              </Dropdown.Toggle>

              <Dropdown.Menu>

                <Dropdown.Header>Fees</Dropdown.Header>

                <Dropdown.Header>Sector</Dropdown.Header>

              </Dropdown.Menu>
              
            </Dropdown>

          </div>

          <div className='right'>

            <Button
              className='btn-light btn-sm border'
              onClick={() => toggleFullscreen()}
              >
              <FontAwesomeIcon icon={ menuFS ? faCompress : faExpand }/>
            </Button>

            <Button
              className='btn-light btn-sm border'
              onClick={() => toggleMenu()}
              >
              <FontAwesomeIcon icon={ faXmark }/>
            </Button>

          </div>

        </header>

        <Table striped hover>

          <thead>
            <tr>
              <th>Company</th>
              <th>Address</th>
              <th>Sector</th>
              <th>Fees</th>
              <th>Stock Symbol</th>
            </tr>
          </thead>

          <tbody>
            {
              companies.map(company => {

                return (
                  <TableRow data={ company } key={ company.id }/>
                )

              })
            }
          </tbody>

        </Table>

      </div>

    </div>
  )

}

const TableRow = props => {

  const { data } = useMemo(() => props, [props]);

  const {
    company,
    address,
    fees,
    id,
    sector,
    stockSymbol
  } = useMemo(() => data, [data]);

  return (
    <tr id={ id }>
      <td>{ company }</td>
      <td>{ address }</td>
      <td>{ sector }</td>
      <td>{ fees.amount } <b>{ fees.currency }</b> </td>
      <td>{ stockSymbol }</td>
    </tr>
  )

}

export default App;