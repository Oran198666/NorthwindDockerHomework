import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { VatCalculator } from "./vat-calculator";

describe("VatCalculator", () => {

    beforeEach(() => render(<VatCalculator />));
    afterEach(cleanup);

    it("should render label and input", () => {
        const input = screen.getByLabelText(/enter price:/i);
        const vatText = screen.getByText(/vat:/i);
        expect(input).toBeInTheDocument();
        expect(vatText).toHaveTextContent("VAT:");
    });

    it("should calculate VAT when price is entered", () => {
        const input = screen.getByLabelText(/enter price:/i);
        fireEvent.change(input, { target: { value: "100" } });
        const vatText = screen.getByText(/vat:/i);
        expect(vatText).toHaveTextContent("VAT: ₪18.00");
    });

});