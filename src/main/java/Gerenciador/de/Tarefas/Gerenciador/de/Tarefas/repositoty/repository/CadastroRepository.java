package Gerenciador.de.Tarefas.Gerenciador.de.Tarefas.repositoty.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CadastroRepository extends JpaRepository<CadastroRepository,Long> {
 Optional<CadastroRepository>findByEmail(String email);
}
