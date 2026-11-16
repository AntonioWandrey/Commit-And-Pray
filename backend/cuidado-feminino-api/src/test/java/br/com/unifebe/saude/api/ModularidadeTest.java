package br.com.unifebe.saude.api;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

public class ModularidadeTest {
    private final ApplicationModules modulos =
            ApplicationModules.of(CuidadoFemininoApiApplication.class);

    @Test
    void imprimeEstruturaDosModulos() {
        modulos.forEach(System.out::println);
    }

    @Test
    void verificaFronteirasEntreModulos() {
        modulos.verify();
    }
}
