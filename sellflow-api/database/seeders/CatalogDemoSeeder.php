<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CatalogDemoSeeder extends Seeder
{
    public function run(): void
    {
        $business = Business::where('slug', 'coffee-house')->first();

        if (! $business) {
            $user = User::firstOrCreate(
                ['email' => 'demo@sellflow.test'],
                ['name' => 'Coffee House Owner', 'password' => Hash::make('password')]
            );

            $business = $user->business ?: Business::create([
                'user_id' => $user->id,
                'name' => 'Coffee House',
                'slug' => 'coffee-house',
                'description' => 'Fresh coffee, handcrafted drinks, and delicious food made daily.',
                'email' => 'hello@coffeehouse.test',
                'phone' => '+855 12 345 678',
                'address' => '123 Riverside Road',
                'city' => 'Phnom Penh',
                'country' => 'Cambodia',
                'primary_color' => '#7C3AED',
                'secondary_color' => '#1E293B',
                'is_active' => true,
            ]);
        }

        $categoryData = [
            ['name' => 'Coffee', 'slug' => 'coffee', 'description' => 'Espresso classics and specialty coffee.', 'sort_order' => 1],
            ['name' => 'Tea', 'slug' => 'tea', 'description' => 'Refreshing hot and iced tea selections.', 'sort_order' => 2],
            ['name' => 'Cold Drinks', 'slug' => 'cold-drinks', 'description' => 'Coolers, smoothies, and blended drinks.', 'sort_order' => 3],
            ['name' => 'Bakery', 'slug' => 'bakery', 'description' => 'Fresh pastries and baked favorites.', 'sort_order' => 4],
            ['name' => 'Meals', 'slug' => 'meals', 'description' => 'Satisfying breakfast and lunch dishes.', 'sort_order' => 5],
        ];

        $categories = [];

        foreach ($categoryData as $data) {
            $category = Category::updateOrCreate(
                ['business_id' => $business->id, 'slug' => $data['slug']],
                [...$data, 'is_active' => true]
            );
            $categories[$data['slug']] = $category;
        }

        $products = [
            ['coffee', 'Espresso', 'espresso', 'CF-001', 'Rich double-shot espresso with a smooth crema.', 2.50, null, 40, true],
            ['coffee', 'Caffè Latte', 'caffe-latte', 'CF-002', 'Espresso balanced with silky steamed milk.', 3.75, 3.25, 30, true],
            ['coffee', 'Cappuccino', 'cappuccino', 'CF-003', 'Espresso, steamed milk, and a thick foam cap.', 3.50, null, 25, false],
            ['coffee', 'Iced Americano', 'iced-americano', 'CF-004', 'Bold espresso poured over chilled water and ice.', 3.00, null, 35, false],
            ['tea', 'Jasmine Green Tea', 'jasmine-green-tea', 'TE-001', 'Fragrant jasmine blossoms with delicate green tea.', 2.75, null, 28, false],
            ['tea', 'Thai Milk Tea', 'thai-milk-tea', 'TE-002', 'Sweet spiced tea finished with creamy milk.', 3.50, 3.00, 24, true],
            ['tea', 'Peach Iced Tea', 'peach-iced-tea', 'TE-003', 'Black tea with ripe peach and fresh citrus.', 3.25, null, 20, false],
            ['tea', 'Matcha Latte', 'matcha-latte', 'TE-004', 'Premium matcha whisked with smooth steamed milk.', 4.25, null, 18, true],
            ['cold-drinks', 'Mango Smoothie', 'mango-smoothie', 'CD-001', 'Fresh mango blended into a tropical smoothie.', 4.50, null, 16, true],
            ['cold-drinks', 'Strawberry Frappe', 'strawberry-frappe', 'CD-002', 'Creamy strawberry blend topped with whipped cream.', 4.75, 4.25, 14, false],
            ['cold-drinks', 'Passion Fruit Soda', 'passion-fruit-soda', 'CD-003', 'Sparkling soda with bright passion fruit.', 3.50, null, 22, false],
            ['cold-drinks', 'Chocolate Frappe', 'chocolate-frappe', 'CD-004', 'Rich chocolate blended with milk and ice.', 4.50, null, 15, false],
            ['bakery', 'Butter Croissant', 'butter-croissant', 'BK-001', 'Flaky all-butter croissant baked fresh daily.', 2.75, null, 12, true],
            ['bakery', 'Chocolate Muffin', 'chocolate-muffin', 'BK-002', 'Soft cocoa muffin loaded with chocolate chips.', 3.00, null, 10, false],
            ['bakery', 'Cinnamon Roll', 'cinnamon-roll', 'BK-003', 'Soft spiral pastry with cinnamon and vanilla glaze.', 3.25, 2.75, 8, false],
            ['bakery', 'Blueberry Cheesecake', 'blueberry-cheesecake', 'BK-004', 'Creamy cheesecake topped with blueberry compote.', 4.50, null, 6, true],
            ['meals', 'Avocado Toast', 'avocado-toast', 'ML-001', 'Sourdough toast, avocado, egg, and mixed seeds.', 6.50, null, 12, true],
            ['meals', 'Chicken Club Sandwich', 'chicken-club-sandwich', 'ML-002', 'Grilled chicken, bacon, lettuce, and tomato.', 7.25, 6.50, 10, false],
            ['meals', 'Breakfast Croissant', 'breakfast-croissant', 'ML-003', 'Croissant filled with egg, cheese, and smoked ham.', 5.75, null, 9, false],
            ['meals', 'Pesto Pasta', 'pesto-pasta', 'ML-004', 'Pasta tossed with basil pesto and parmesan.', 8.50, null, 8, true],
        ];

        foreach ($products as [$categorySlug, $name, $slug, $sku, $description, $price, $discount, $stock, $featured]) {
            Product::updateOrCreate(
                ['business_id' => $business->id, 'slug' => $slug],
                [
                    'category_id' => $categories[$categorySlug]->id,
                    'name' => $name,
                    'sku' => $sku,
                    'description' => $description,
                    'price' => $price,
                    'discount_price' => $discount,
                    'stock' => $stock,
                    'thumbnail' => null,
                    'is_featured' => $featured,
                    'is_active' => true,
                ]
            );
        }

        $this->command?->info("Seeded {$business->name}: 5 categories and 20 products.");
    }
}
