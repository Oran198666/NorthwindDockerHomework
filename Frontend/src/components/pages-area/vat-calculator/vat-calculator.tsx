import { ChangeEvent, useId, useState } from "react";
import "./vat-calculator.css";
import { monetaryService } from "../../../services/monetary-service";


export function VatCalculator() {

    const [price, setPrice] = useState<number>(0);
    const [vat, setVat] = useState<number>(0);
    const priceId = useId();

    function handleChange(args: ChangeEvent<HTMLInputElement>) {
        const price = +args.target.value;
        setPrice(price);
        const vat = monetaryService.getVat(price, 18);
        setVat(vat);
    }

    function clear() {
        setPrice(0);
        setVat(0);
    }

    return (
        <div className="VatCalculator">

            <h2>Vat Calculator</h2>
            <label htmlFor={priceId}>Enter price:</label>
            <input id={priceId} type="number" value={price} onChange={handleChange} />
            <span aria-live="polite">VAT: ₪{vat.toFixed(2)}</span>
            <button onClick={clear}>Clear</button>
        </div>
    );
}