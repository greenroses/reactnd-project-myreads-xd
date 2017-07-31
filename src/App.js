import React from 'react'
import { Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import ListBooks from './ListBooks'
import * as BooksAPI from './BooksAPI'
import './App.css'
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'


class BooksApp extends React.Component {
  state = {
    books: [],
    query:'',
    showingBooks: []
  }

  updateQuery = query => {
    this.setState({ query: query})
    if (query!=='') {
      BooksAPI.search(query,20).then(results => {
        if (results && results.length>0){
          for (const b of results) {
            b.shelf="none";
            for (const book of this.state.books){
              if (b.id === book.id) {
                b.shelf = book.shelf;
                break;
              }
            }
          }
          this.setState({showingBooks: results});
        }
      })
    }
    console.log(query);

  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({ books })
    })
  }

  updateBook = (book, newShelf) => {
    let data=this.state.books;
    for (let i=0; i<data.length; i++) {
      if (data[i].id === book.id) {
        data[i].shelf=newShelf;
        break;
      }
    }
    data.push(book);
    data[data.indexOf(book)].shelf=newShelf;
    this.setState({books: data});
    BooksAPI.update(book, newShelf)
  }




  render() {


    return (

      <div className="app">
        <Route path="/search" render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link
                to="/"
                className="close-search"
              >Close</Link>

              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}

                <input
                  type="text"
                  placeholder="Search by title or author"
                  value={this.state.query}
                  onChange={(event) => this.updateQuery(event.target.value)}
                />
              </div>
            </div>
            <div className="search-books-results">
              <ListBooks onUpdateBook={this.updateBook} books={this.state.showingBooks}/>
            </div>
          </div>
        )}/>

        <Route exact path="/" render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ListBooks onUpdateBook={this.updateBook} books={this.state.books.filter(book => book.shelf==="currentlyReading")}/>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ListBooks onUpdateBook={this.updateBook} books={this.state.books.filter(book => book.shelf==="wantToRead")}/>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ListBooks onUpdateBook={this.updateBook} books={this.state.books.filter(book => book.shelf==="read")}/>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}

export default BooksApp
