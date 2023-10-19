import React from 'react'

function CustomerBillPay() {
    return (
        <div>
            <h1>This is a placeholder for the customer bill payment screen.</h1>
            <label>
                Select Acount to Pay From
                <select>
                    <option value="test1">TBA</option>
                </select>
                <form>
                    <div>
                        <label>Pay To</label>
                        <label>Amount</label>
                    </div>
                </form>
            </label>
            <button type="submit">Pay Bill</button>
        </div>
    )
}
export default CustomerBillPay;