const express = require("express")
const axios = require("axios")
const cors = require("cors")
const app = express()
app.use(cors())
const ValiditeCheckList = (data) => {
    // const {isUkResident, riskRating, ltv, isValuationFeePaid} = data
    const isUkResident = data.isUkResident
    const riskRating = data.riskRating
    const isValuationFeePaid = data.isValuationFeePaid
    const loanRequired = data.mortgage.loanRequired
    const purchasePrice = data.mortgage.purchasePrice
    
    return [
        {
            name: 'UK Resident',
            status: isUkResident === true ? "Passed" : "Failed"
        },
        {
            name: 'Risk Rating Medium',
            status: riskRating === "Medium" ? "Passed" : "Failed"
        },
        {
            name: 'Valuation Fee Paid',
            status: isValuationFeePaid === true ? "Passed" : "Failed"
        },
        {
            name: 'LTV Below 60%',
            status: (parseInt(loanRequired.replace('£', ''))
                / parseInt(purchasePrice.replace('£', ''))) * 100 < 60
                ? "Passed" : "Failed"
        }

    ]
}
let response
const dataFetching = async () => {
    response = await axios.get("http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639")
}
dataFetching()
app.get("/", async (req, res) => {
    const result = ValiditeCheckList(response.data)
    res.send(result)
})
app.listen(3000, () => console.log(`Server is running at PORT 3000`))