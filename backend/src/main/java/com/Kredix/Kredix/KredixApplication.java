package com.Kredix.Kredix;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class KredixApplication {

	public static void main(String[] args) {
		SpringApplication.run(KredixApplication.class, args);
	}

}
