import React, { Component } from 'react'
import { connect } from 'react-redux'

import { getListingIds } from '../actions/Listing'
import { sortKey, sortOrder } from '../actions/Filtering'

import Pagination from 'react-js-pagination'
import { withRouter } from 'react-router'

import ListingCard from './listing-card'

// temporary - we should be getting an origin instance from our app,
// not using a global singleton
import origin from '../services/origin'

import beautyServicesJson from '../../public/schemas/beauty-services.json';

class ListingsGrid extends Component {
  constructor(props) {
    super(props)
    this.state = {
      listingsPerPage: 12,
      listingData: []
    }
  }

  componentWillMount() {
    this.props.getListingIds()
  }

  async componentWillReceiveProps(nextProps) {
    try {
      const listingData = [];
      for (let id of nextProps.listingIds) {
        const listing = await origin.listings.getByIndex(id)
        const data = Object.assign({}, listing)
        listingData.push({ id, data });
      }

      console.log("listingData", listingData)
      this.setState({ listingData });
    } catch (error) {
      console.error(`Error fetching contract or IPFS info for listingId: ${this.props.listingId}`)
    }
  }

  checkDaysIntersection(weekDayFrom, weekDayTo, weekDays) {
    const weekDaysList = beautyServicesJson.properties.weekDayFrom.enum

    const weekDayFromIdx = weekDaysList.indexOf(weekDayFrom)
    const weekDayToIdx = weekDaysList.indexOf(weekDayTo)

    const range = weekDaysList.slice(weekDayFromIdx, weekDayToIdx + 1)

    return weekDays.filter(day => range.indexOf(day) !== -1).length !== 0
  }

  render() {
    const { listingsPerPage, listingData } = this.state
    const { filtering } = this.props

    let filteredData = !filtering.location
      ? listingData
      : listingData
        .filter(item => item.data.location.toLowerCase()
          .indexOf(filtering.location.toLowerCase()) !== -1)

    filteredData = !filtering.name
      ? filteredData
      : filteredData
        .filter(item => item.data.name.toLowerCase()
          .indexOf(filtering.name.toLowerCase()) !== -1)

    // TODO: Enable after filling of the web-shop
    filteredData = filteredData
      .filter(item =>
        filtering.beautyServices.includes(item.data.category) ||
        filtering.cosmetics.includes(item.data.category))

    // day of the week
    filteredData = filtering.weekDays.length === 7
      ? filteredData
      : filteredData
        .filter(item => !item.data.weekDayFrom ||
        this.checkDaysIntersection(item.data.weekDayFrom, item.data.weekDayTo, filtering.weekDays))

    // hour of the day
    filteredData = filteredData
      .filter(item => !item.data.dayHourFrom ||
      filtering.dayHourFrom >= item.data.dayHourFrom && filtering.dayHourFrom <= item.data.dayHourTo ||
      filtering.dayHourTo >= item.data.dayHourFrom && filtering.dayHourTo <= item.data.dayHourTo ||
      filtering.dayHourFrom <= item.data.dayHourFrom && filtering.dayHourTo >= item.data.dayHourTo)

    const sortedListingData = (() => {
      let sortedData
      switch (filtering.sortKey) {
        case sortKey.name:
          sortedData = filteredData.sort(
            (a, b) => {
              const nameA = a.data.name.toUpperCase()
              const nameB = b.data.name.toUpperCase()
              return nameA === nameB ? 0 : nameA > nameB ? 1 : -1
            }
          )

          return filtering.sortOrder ===  sortOrder.asc ? sortedData : sortedData.reverse()

        case sortKey.category:
          sortedData = filteredData.sort(
            (a, b) => {
              const categoryA = a.data.category.toUpperCase()
              const categoryB = b.data.category.toUpperCase()
              return categoryA === categoryB ? 0 : categoryA > categoryB ? 1 : -1
            }
          )

          return filtering.sortOrder ===  sortOrder.asc ? sortedData : sortedData.reverse()

        case sortKey.price:
          sortedData = filteredData.sort(
            (a, b) => {
              const priceA = a.data.price
              const priceB = b.data.price
              return priceA === priceB ? 0 : priceA > priceB ? 1 : -1
            }
          )

          return filtering.sortOrder ===  sortOrder.asc ? sortedData : sortedData.reverse()

        default:
          return filteredData
      }
    })()

    const { contractFound, listingIds } = this.props

    const activePage = this.props.match.params.activePage || 1
    // Calc listings to show for given page
    const showListingsIds = listingIds.slice(
      listingsPerPage * (activePage - 1),
      listingsPerPage * activePage
    )

    return (
      <div className="listings-wrapper">
        {contractFound === false && (
          <div className="listings-grid">
            <div className="alert alert-warning" role="alert">
              The Origin Contract was not found on this network.<br />
              You may need to change networks, or deploy the contract.
            </div>
          </div>
        )}
        {contractFound && (
          <div className="listings-grid">
            {sortedListingData.length > 0 && <h1>{sortedListingData.length} Listings</h1>}
            <div className="row">
              {sortedListingData.map(item => (
                <ListingCard listingId={item.id} key={item.id} data={item.data} />
              ))}
            </div>
            <Pagination
              activePage={activePage}
              itemsCountPerPage={listingsPerPage}
              totalItemsCount={listingIds.length}
              pageRangeDisplayed={5}
              onChange={page => this.props.history.push(`/page/${page}`)}
              itemClass="page-item"
              linkClass="page-link"
              hideDisabled="true"
            />
          </div>
        )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  listingIds: state.listings.ids,
  contractFound: state.listings.contractFound,
  filtering: state.filtering
})

const mapDispatchToProps = dispatch => ({
  getListingIds: () => dispatch(getListingIds())
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(ListingsGrid)
)
