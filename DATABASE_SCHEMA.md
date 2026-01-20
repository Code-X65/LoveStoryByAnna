# Database Schema Reference

## Quick Reference for LoveStory by Anna Database

---

## 📦 Products Table

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  collection TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  images TEXT[],
  stock INTEGER DEFAULT 0,
  sizes TEXT[],
  colors TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_subcategory ON products(subcategory);
CREATE INDEX idx_products_is_active ON products(is_active);
```

**Example Data**:
```json
{
  "id": "uuid",
  "name": "Classic White T-Shirt",
  "description": "Comfortable cotton t-shirt",
  "category": "GIRLS",
  "subcategory": "TOPS",
  "collection": "T-SHIRTS",
  "price": 2500,
  "original_price": 3000,
  "images": ["url1.jpg", "url2.jpg"],
  "stock": 50,
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["White", "Black"],
  "is_active": true
}
```

---

## 🛒 Orders Table

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,
  payment_reference TEXT,
  shipping_address JSONB NOT NULL,
  shipping_method TEXT DEFAULT 'standard',
  subtotal NUMERIC NOT NULL,
  shipping_cost NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
```

**Example Data**:
```json
{
  "id": "uuid",
  "user_id": "user-uuid",
  "order_number": "ORD-20241227-001",
  "status": "delivered",
  "payment_status": "paid",
  "payment_method": "card",
  "payment_reference": "REF123456",
  "shipping_address": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "zipCode": "100001",
    "phone": "+234 801 234 5678",
    "email": "john@example.com"
  },
  "shipping_method": "express",
  "subtotal": 12500,
  "shipping_cost": 1500,
  "tax": 937.5,
  "total": 14937.5
}
```

---

## 📦 Order Items Table

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  quantity INTEGER NOT NULL,
  size TEXT,
  color TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

**Example Data**:
```json
{
  "id": "uuid",
  "order_id": "order-uuid",
  "product_id": "product-uuid",
  "name": "Classic White T-Shirt",
  "price": 2500,
  "quantity": 2,
  "size": "M",
  "color": "White",
  "image_url": "product-image.jpg"
}
```

---

## 📍 Addresses Table

```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT,
  name TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zipCode TEXT,
  phone TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_is_default ON addresses(is_default);
```

**Example Data**:
```json
{
  "id": "uuid",
  "user_id": "user-uuid",
  "label": "Home",
  "name": "John Doe",
  "email": "john@example.com",
  "address": "123 Main Street, Victoria Island",
  "city": "Lagos",
  "state": "Lagos",
  "zipCode": "100001",
  "phone": "+234 801 234 5678",
  "is_default": true
}
```

---

## 👤 User Profiles Table

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  firstName TEXT,
  lastName TEXT,
  displayName TEXT,
  email TEXT,
  phone TEXT,
  photoURL TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
```

**Example Data**:
```json
{
  "id": "user-uuid",
  "firstName": "John",
  "lastName": "Doe",
  "displayName": "John Doe",
  "email": "john@example.com",
  "phone": "+234 801 234 5678",
  "photoURL": "avatar.jpg"
}
```

---

## 🛒 Cart Items Table

```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id, size, color)
);

-- Indexes
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
```

---

## ❤️ Wishlist Items Table

```sql
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Indexes
CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);
CREATE INDEX idx_wishlist_items_product_id ON wishlist_items(product_id);
```

---

## 🔒 Row Level Security (RLS) Policies

### **Products** (Public Read, Admin Write)
```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (is_active = true);

-- Allow authenticated users to view all
CREATE POLICY "Authenticated users can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);
```

### **Orders** (User-specific)
```sql
-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can create their own orders
CREATE POLICY "Users can create their own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
```

### **Order Items** (User-specific via orders)
```sql
-- Enable RLS
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can view items from their orders
CREATE POLICY "Users can view their own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );
```

### **Addresses** (User-specific)
```sql
-- Enable RLS
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Users can manage their own addresses
CREATE POLICY "Users can view their own addresses"
  ON addresses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
  ON addresses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
  ON addresses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
  ON addresses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

### **User Profiles** (User-specific)
```sql
-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

### **Cart Items** (User-specific)
```sql
-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Users can manage their own cart
CREATE POLICY "Users can manage their own cart"
  ON cart_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);
```

### **Wishlist Items** (User-specific)
```sql
-- Enable RLS
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Users can manage their own wishlist
CREATE POLICY "Users can manage their own wishlist"
  ON wishlist_items FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);
```

---

## 🔄 Database Functions

### **Generate Order Number**
```sql
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
BEGIN
  new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                LPAD(NEXTVAL('order_number_seq')::TEXT, 4, '0');
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Create sequence
CREATE SEQUENCE IF NOT EXISTS order_number_seq;
```

### **Update Timestamp Trigger**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 📊 Useful Queries

### **Get User's Order History**
```sql
SELECT 
  o.*,
  json_agg(
    json_build_object(
      'name', oi.name,
      'price', oi.price,
      'quantity', oi.quantity,
      'size', oi.size,
      'image_url', oi.image_url
    )
  ) as items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = 'user-uuid'
GROUP BY o.id
ORDER BY o.created_at DESC;
```

### **Search Products**
```sql
SELECT *
FROM products
WHERE 
  is_active = true
  AND (
    name ILIKE '%search-term%'
    OR description ILIKE '%search-term%'
    OR category ILIKE '%search-term%'
  )
ORDER BY created_at DESC
LIMIT 10;
```

### **Get User's Default Address**
```sql
SELECT *
FROM addresses
WHERE user_id = 'user-uuid'
  AND is_default = true
LIMIT 1;
```

---

## 🎯 Best Practices

1. **Always use UUID** for primary keys
2. **Enable RLS** on all user-specific tables
3. **Create indexes** on frequently queried columns
4. **Use JSONB** for flexible data structures
5. **Add timestamps** to track record changes
6. **Use CASCADE** for related data cleanup
7. **Validate data** at application level
8. **Use transactions** for multi-table operations

---

**Last Updated**: December 27, 2024
