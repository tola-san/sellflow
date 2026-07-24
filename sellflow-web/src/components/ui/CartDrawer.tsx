import { AnimatePresence, motion } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { ThemeSettings } from "../../types/theme";
import { useCart } from "../cart/CartContext";

interface CartDrawerProps {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeSettings;
}

export function CartDrawer({
  slug,
  isOpen,
  onClose,
  theme,
}: CartDrawerProps) {
  const cart = useCart();

  // Rename this if your CartContext uses another method.
  const items = cart.items(slug);

  const subtotal = items.reduce((total, item) => total + item.unit_price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.button
            type="button"
            aria-label="Close cart"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] cursor-default bg-slate-950/45 backdrop-blur-[2px]"
          />

          {/* Drawer */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-drawer-title"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 360,
              damping: 34,
            }}
            className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-md flex-col shadow-2xl"
            style={{
              backgroundColor: theme.surface_color,
              color: theme.text_color,
            }}
          >
            {/* Drawer header */}
            <div
              className="flex h-16 items-center justify-between border-b px-5"
              style={{
                borderColor: `${theme.muted_color}35`,
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-10 w-10 place-items-center rounded-xl text-white"
                  style={{
                    backgroundColor: theme.primary_color,
                  }}
                >
                  <ShoppingBag size={19} />
                </span>

                <div>
                  <h2
                    id="cart-drawer-title"
                    className="font-bold"
                  >
                    Your cart
                  </h2>

                  <p
                    className="text-xs"
                    style={{ color: theme.muted_color }}
                  >
                    {cart.count(slug)}{" "}
                    {cart.count(slug) === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {items.length === 0 ? (
                <div className="grid min-h-[60vh] place-items-center text-center">
                  <div>
                    <span
                      className="mx-auto grid h-16 w-16 place-items-center rounded-2xl"
                      style={{
                        backgroundColor: `${theme.primary_color}12`,
                        color: theme.primary_color,
                      }}
                    >
                      <ShoppingBag size={30} />
                    </span>

                    <h3 className="mt-5 text-lg font-bold">
                      Your cart is empty
                    </h3>

                    <p
                      className="mx-auto mt-2 max-w-xs text-sm"
                      style={{ color: theme.muted_color }}
                    >
                      Add products from the catalog to start your
                      order.
                    </p>

                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-6 px-5 py-3 text-sm font-semibold text-white"
                      style={{
                        backgroundColor: theme.primary_color,
                        borderRadius: "var(--store-radius)",
                      }}
                    >
                      Continue shopping
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const unitPrice = item.unit_price;

                    return (
                      <article
                        key={item.line_id}
                        className="flex gap-4 border-b pb-4"
                        style={{
                          borderColor: `${theme.muted_color}25`,
                        }}
                      >
                        <div
                          className="h-20 w-20 shrink-0 overflow-hidden rounded-xl"
                          style={{
                            backgroundColor: `${theme.muted_color}12`,
                          }}
                        >
                          {item.product.thumbnail ? (
                            <img
                              src={item.product.thumbnail}
                              alt={item.product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="grid h-full place-items-center">
                              <ShoppingBag
                                size={24}
                                style={{
                                  color: theme.muted_color,
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="line-clamp-2 text-sm font-semibold">
                                {item.product.name}
                              </h3>

                              <p
                                className="mt-1 text-xs"
                                style={{
                                  color: theme.muted_color,
                                }}
                              >
                                {item.product.category.name}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                cart.remove(
                                  slug,
                                  item.line_id
                                )
                              }
                              aria-label={`Remove ${item.product.name}`}
                              className="shrink-0 rounded-lg p-1.5 text-red-500 transition hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div
                              className="flex items-center border"
                              style={{
                                borderRadius:
                                  "var(--store-radius)",
                                borderColor: `${theme.muted_color}40`,
                              }}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  cart.update(
                                    slug,
                                    item.line_id,
                                    item.quantity - 1
                                  )
                                }
                                className="grid h-8 w-8 place-items-center"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={14} />
                              </button>

                              <span className="min-w-8 text-center text-sm font-semibold">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  cart.update(
                                    slug,
                                    item.line_id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={
                                  item.quantity >= item.product.stock
                                }
                                className="grid h-8 w-8 place-items-center disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Increase quantity"
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <strong>
                              $
                              {(
                                unitPrice * item.quantity
                              ).toFixed(2)}
                            </strong>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Drawer footer */}
            {items.length > 0 && (
              <div
                className="border-t px-5 py-5"
                style={{
                  borderColor: `${theme.muted_color}35`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-sm"
                    style={{ color: theme.muted_color }}
                  >
                    Subtotal
                  </span>

                  <strong className="text-2xl">
                    ${subtotal.toFixed(2)}
                  </strong>
                </div>

                <p
                  className="mt-2 text-xs"
                  style={{ color: theme.muted_color }}
                >
                  Delivery fees and final total are calculated at
                  checkout.
                </p>

                <Link
                  to={`/${slug}/checkout`}
                  onClick={onClose}
                  className="mt-5 flex w-full items-center justify-center px-5 py-3 text-sm font-semibold text-white"
                  style={{
                    backgroundColor: theme.primary_color,
                    borderRadius: "var(--store-radius)",
                  }}
                >
                  Continue to checkout
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full px-5 py-3 text-sm font-semibold"
                  style={{
                    color: theme.primary_color,
                  }}
                >
                  Continue shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
