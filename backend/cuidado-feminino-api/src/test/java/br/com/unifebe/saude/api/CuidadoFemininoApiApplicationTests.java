package br.com.unifebe.saude.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@Import(TestcontainersConfiguration.class)
@SpringBootTest
class CuidadoFemininoApiApplicationTests {

	@Test
	void contextLoads() {
	}

}
