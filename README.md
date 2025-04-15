> [!WARNING]
> This project is using the beta version of [React Compiler](https://react.dev/learn/react-compiler), use at your own risk, as currently unstable.

# Delicioso Treats

Delicioso Treats is a commerce application designed to sell cakes, savories, and other bakery goods.

![image](https://github.com/user-attachments/assets/e6eed220-ed78-4e80-86f0-14bcf032c8a1)

## Features
- **Stripe Integration:** Ensures secure and smooth transactions for online orders.
- **Custom Design:** Co-designed with my mother to reflect the warmth and charm of her bakery.
- **AWS S3 Storage & Cloudfront:** Used to process product images and deliver images to client.

## Stack
- **Laravel**
- **React**
- **Tailwind**
- **Inertia**

## Installation
### Prerequisites
- [Bun](https://bun.sh/)
- PHP 8.1+
- Composer

### Setup
```bash
# Clone the repository
git clone https://github.com/rv-bit/delicioso/
cd delicioso

# Install dependencies
bun install
composer install

# Set up your environment variables using .env.example

# Generate the application key
php artisan key:generate

# Run migrations and seed the database
php artisan migrate --seed

# Start the development server
composer run dev
```

# A Note of Inspiration
This project is more than just code — it's a tribute to my mother's passion for baking. By blending technology with creativity, I wanted to show her that anything is possible, and that the skills we nurture can bring any dream to life.
