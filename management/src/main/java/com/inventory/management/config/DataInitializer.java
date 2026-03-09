package com.inventory.management.config;

import com.inventory.management.entity.Product;
import com.inventory.management.entity.Role;
import com.inventory.management.entity.User;
import com.inventory.management.repository.ProductRepository;
import com.inventory.management.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(admin);
                System.out.println("Default admin user created: admin / admin123");
            }

            if (userRepository.findByUsername("employee").isEmpty()) {
                User employee = User.builder()
                        .username("employee")
                        .password(passwordEncoder.encode("employee123"))
                        .role(Role.EMPLOYEE)
                        .build();
                userRepository.save(employee);
                System.out.println("Default employee user created: employee / employee123");
            }

            // Seed products using setters for better reliability
            if (productRepository.count() == 0) {
                Product p1 = new Product();
                p1.setName("Gaming Laptop");
                p1.setQuantity(3);
                p1.setPrice(1200.0);
                p1.setCategory("Electronics");
                p1.setSupplier("Dell");
                productRepository.save(p1);

                Product p2 = new Product();
                p2.setName("Wireless Mouse");
                p2.setQuantity(15);
                p2.setPrice(25.0);
                p2.setCategory("Accessories");
                p2.setSupplier("Logitech");
                productRepository.save(p2);

                Product p3 = new Product();
                p3.setName("Mechanical Keyboard");
                p3.setQuantity(2);
                p3.setPrice(80.0);
                p3.setCategory("Accessories");
                p3.setSupplier("Razer");
                productRepository.save(p3);

                Product p4 = new Product();
                p4.setName("Monitor");
                p4.setQuantity(8);
                p4.setPrice(300.0);
                p4.setCategory("Electronics");
                p4.setSupplier("Samsung");
                productRepository.save(p4);

                Product p5 = new Product();
                p5.setName("USB-C Hub");
                p5.setQuantity(20);
                p5.setPrice(45.0);
                p5.setCategory("Accessories");
                p5.setSupplier("Anker");
                productRepository.save(p5);

                System.out.println("Seeded initial products via setters");
            }

        };
    }
}
