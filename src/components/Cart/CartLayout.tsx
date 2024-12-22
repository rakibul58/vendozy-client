import { CartModal } from "./CartModal";
import { VendorAlertDialog } from "./VendorAlertDialog";

export const CartLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <CartModal />
      <VendorAlertDialog />
    </>
  );
};
