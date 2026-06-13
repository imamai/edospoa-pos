def get_pizza_price(size):
    prices = {"small": 8, "large": 12}
    return prices[size]

def get_delivery_fee(miles):
    if miles <= 5:
        return 2
    return 2 + (miles - 5) * 1

def main():
    print("=== Pizza Delivery Order ===\n")

    size = input("Pizza size (small/large): ").strip().lower()
    while size not in ("small", "large"):
        size = input("Please enter 'small' or 'large': ").strip().lower()

    toppings = int(input("Number of toppings: ").strip())
    miles = float(input("Delivery distance (miles): ").strip())

    base_price = get_pizza_price(size)
    topping_cost = toppings * 1
    delivery_fee = get_delivery_fee(miles)
    total = base_price + topping_cost + delivery_fee

    print(f"\n--- Order Summary ---")
    print(f"  {size.capitalize()} pizza:  ${base_price:.2f}")
    print(f"  Toppings ({toppings}):    ${topping_cost:.2f}")
    print(f"  Delivery fee:    ${delivery_fee:.2f}")
    print(f"  ---------------------")
    print(f"  Total:           ${total:.2f}")

if __name__ == "__main__":
    main()
