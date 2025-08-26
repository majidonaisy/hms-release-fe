import { useEffect, useState } from "react"
import { getPayouts } from "@/services/Payout";

const Payouts = () => {
    const [payouts, setPayouts] = useState<any | null>(null);

    const fetchPayouts = async () => {
        try {
            const response = await getPayouts();
            setPayouts(response);
        } catch (error: any) {
            console.error("Failed to get Payouts");
        }
    };

    useEffect(() => {
        fetchPayouts();
    }, []);

    console.log(payouts)

    return (

        <div className="p-6 bg-gray-50 min-h-screen"></div>

    );
};

export default Payouts;