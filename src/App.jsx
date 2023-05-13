import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { publicAxios } from '../lib/publicAxios';
import { Container, Grid } from '@mui/material';
import axios from 'axios';

export default function App() {
  const [data, setData] = useState([]);

  const getProducts = async () => {
    try {
      let getData = await publicAxios.get('/products');

      if (getData.status == 200) {
        setData(getData.data);
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  let cancelToken;

  const handleFilterData = async param => {
    if (typeof cancelToken != typeof undefined) {
      cancelToken.cancel('Operation canceled due to new request.');
    }

    cancelToken = axios.CancelToken.source();

    let inputValue = param.toLowerCase();

    if (param.length > 0) {
      try {
        let getData = await publicAxios.get(
          `/products/search?q=${inputValue}&select=title,brand,price,rating`,
          { cancelToken: cancelToken.token }
        );

        if (getData.status == 200) {
          console.log(getData, '-00-0-');
          setData(getData.data);
        }
      } catch (err) {
        throw new Error(err);
      }
    } else {
      getProducts();
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleOrderBy = e => {
    let value = e.target.value;

    if (value == 1) {
      let arr = [];

      let orderedByTitle = data.products.sort((a, b) =>
        a.title.localeCompare(b.title)
      );

      for (let i = 0; i < orderedByTitle.length; i++) {
        arr.push(orderedByTitle[i]);
      }

      setData(prevState => ({ ...prevState, products: arr }));
    } else if (value == 2) {
      function comparePrices(a, b) {
        if (a.price > b.price) {
          return -1;
        } else if (a.price < b.price) {
          return 1;
        }
        return 0;
      }

      let orderedPriceData = data.products.sort(comparePrices);

      setData(prevState => ({ ...prevState, products: orderedPriceData }));
    } else if (value == 3) {
      function comparePrices(a, b) {
        if (a.rating > b.rating) {
          return -1;
        } else if (a.rating < b.rating) {
          return 1;
        }
        return 0;
      }

      let orderedRatingData = data.products.sort(comparePrices);

      setData(prevState => ({ ...prevState, products: orderedRatingData }));
    } else {
      getProducts();
    }
  };

  return (
    <>
      <Container>
        <Grid container>
          <Grid item xs={12}>
            <div className='filterSelect'>
              <select onChange={e => handleOrderBy(e)}>
                <option value={'default'}>order by</option>
                <option value={'1'}>title</option>
                <option value={'2'}>price</option>
                <option value={'3'}>rating</option>
              </select>
            </div>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <span>Title</span>
                    <br />
                    <input
                      type='text'
                      name='title'
                      onChange={e => handleFilterData(e.target.value)}
                    />
                  </TableCell>
                  <TableCell align='right'>
                    <span>Rating</span>
                    <br />
                    <input
                      type='text'
                      name='rating'
                      onChange={e => handleFilterData(e.target.value)}
                    />
                  </TableCell>
                  <TableCell align='right'>
                    <span>Brand</span>
                    <br />
                    <input
                      type='text'
                      name='brand'
                      onChange={e => handleFilterData(e.target.value)}
                    />
                  </TableCell>
                  <TableCell align='right'>
                    <span>Price</span>
                    <br />
                    <input
                      type='text'
                      name='price'
                      onChange={e =>
                        handleFilterData(e.target.value, e.target.name)
                      }
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.products?.map(index => (
                  <TableRow
                    key={index?.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      {index?.title}
                    </TableCell>
                    <TableCell align='right'>{index?.rating}</TableCell>
                    <TableCell align='right'>{index?.brand}</TableCell>
                    <TableCell align='right'>{index?.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Container>
    </>
  );
}
