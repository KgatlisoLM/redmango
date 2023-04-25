import { OrderHeaderModel } from "../../../Interfaces";

export default interface OrderListProps {
    isLoading: boolean;
    orderData: OrderHeaderModel[];
}