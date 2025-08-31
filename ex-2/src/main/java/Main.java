import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        UsuarioDAO dao = new UsuarioDAO();
        Scanner scanner = new Scanner(System.in);
        boolean running = true;


        while (running) {
            System.out.println("\nEscolha uma opção:");
            System.out.println("1 - Listar todos os usuários");
            System.out.println("2 - Listar usuário por ID");
            System.out.println("3 - Inserir novo usuário");
            System.out.println("4 - Atualizar usuário");
            System.out.println("5 - Deletar usuário");
            System.out.println("0 - Sair");

            System.out.print("Opção: ");
            int opcao = scanner.nextInt();
            scanner.nextLine();

            switch (opcao) {
                case 1:
                    List<Usuario> usuarios = dao.getAll();
                    if (usuarios.isEmpty()) {
                        System.out.println("Nenhum usuário encontrado.");
                    } else {
                        usuarios.forEach(System.out::println);
                    }
                    break;

                case 2:
                    System.out.print("Digite o ID do usuário: ");
                    int id = scanner.nextInt();
                    scanner.nextLine();
                    Usuario u = dao.getById(id);
                    if (u != null) {
                        System.out.println(u);
                    } else {
                        System.out.println("Usuário não encontrado.");
                    }
                    break;

                case 3:
                    System.out.print("Digite login: ");
                    String login = scanner.nextLine();
                    System.out.print("Digite senha: ");
                    String senha = scanner.nextLine();
                    System.out.print("Digite sexo (M/F): ");
                    String sexoStr = scanner.nextLine();
                    Character sexo = sexoStr.charAt(0);

                    Usuario novoUsuario = new Usuario(null, login, senha, sexo);
                    if (dao.insert(novoUsuario)) {
                        System.out.println("Usuário inserido com sucesso!");
                    } else {
                        System.out.println("Erro ao inserir usuário.");
                    }
                    break;

                case 4:
                    System.out.print("Digite ID do usuário a atualizar: ");
                    int updateId = scanner.nextInt();
                    scanner.nextLine();

                    Usuario userToUpdate = dao.getById(updateId);
                    if (userToUpdate == null) {
                        System.out.println("Usuário não encontrado.");
                        break;
                    }

                    System.out.print("Novo login (" + userToUpdate.getLogin() + "): ");
                    String newLogin = scanner.nextLine();
                    System.out.print("Nova senha (" + userToUpdate.getSenha() + "): ");
                    String newSenha = scanner.nextLine();
                    System.out.print("Novo sexo (" + userToUpdate.getSexo() + "): ");
                    String newSexoStr = scanner.nextLine();
                    Character newSexo = newSexoStr.isEmpty() ? userToUpdate.getSexo() : newSexoStr.charAt(0);

                    userToUpdate.setLogin(newLogin.isEmpty() ? userToUpdate.getLogin() : newLogin);
                    userToUpdate.setSenha(newSenha.isEmpty() ? userToUpdate.getSenha() : newSenha);
                    userToUpdate.setSexo(newSexo);

                    if (dao.update(userToUpdate)) {
                        System.out.println("Usuário atualizado com sucesso!");
                    } else {
                        System.out.println("Erro ao atualizar usuário.");
                    }
                    break;

                case 5:
                    System.out.print("Digite ID do usuário a deletar: ");
                    int deleteId = scanner.nextInt();
                    scanner.nextLine();

                    if (dao.delete(deleteId)) {
                        System.out.println("Usuário deletado com sucesso!");
                    } else {
                        System.out.println("Erro ao deletar usuário ou usuário não encontrado.");
                    }
                    break;

                case 0:
                    running = false;
                    break;

                default:
                    System.out.println("Opção inválida. Tente novamente.");
                    break;
            }
        }

        dao.disconnect();
        scanner.close();
    }
}
