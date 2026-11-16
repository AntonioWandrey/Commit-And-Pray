package br.com.unifebe.saude.api;

import org.springframework.boot.SpringApplication;

public class TestCuidadoFemininoApiApplication {

	public static void main(String[] args) {
		SpringApplication.from(CuidadoFemininoApiApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
