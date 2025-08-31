import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class UsuarioDAO extends DAO{
    public UsuarioDAO() {
        super();

        if (!existsTable("Usuarios")) {
            System.out.println("Tabela 'Usuarios' não encontrada. Criando a partir do script usersTable.sql");
            createTable("usersTable.sql");
        }
    }

    private boolean existsTable(String tableName) {
        try (ResultSet rs = con.getMetaData().getTables(null, null, tableName, null)) {
            return rs.next();
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    private void createTable(String path) {
        try (BufferedReader br = new BufferedReader(new FileReader(path));
             Statement stmt = con.createStatement()) {

            StringBuilder sql = new StringBuilder();
            String linha;
            while ((linha = br.readLine()) != null) {
                linha = linha.trim();
                if (linha.isEmpty() || linha.startsWith("--")) continue;
                sql.append(linha);
                if (linha.endsWith(";")) {
                    stmt.execute(sql.toString());
                    sql.setLength(0);
                }
            }

            System.out.println("Script executado com sucesso!");

        } catch (IOException | SQLException e) {
            e.printStackTrace();
            System.out.println("Erro ao executar o script SQL.");
        }
    }

    public boolean insert(Usuario usuario){
        String sql = "INSERT INTO Usuarios (login, senha, sexo) VALUES (?,?,?)";
        boolean result = false;
        try(PreparedStatement stmt = super.con.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)){
            stmt.setString(1, usuario.getLogin());
            stmt.setString(2, usuario.getSenha());
            stmt.setString(3, usuario.getSexo().toString());

            int rowsInserted = stmt.executeUpdate();
            result = rowsInserted > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return result;
    }

    public List<Usuario> getAll() {
        List<Usuario> usuarios = new ArrayList<>();
        String sql = "SELECT id, login, senha, sexo FROM Usuarios";

        try (PreparedStatement stmt = super.con.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Integer id = rs.getInt("id");
                String login = rs.getString("login");
                String senha = rs.getString("senha");
                Character sexo = rs.getString("sexo") != null ? rs.getString("sexo").charAt(0) : null;

                usuarios.add(new Usuario(id, login, senha, sexo));
            }

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

        return usuarios;
    }

    public Usuario getById(int id) {
        String sql = "SELECT id, login, senha, sexo FROM Usuarios WHERE id = ?";
        try (PreparedStatement stmt = super.con.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    String login = rs.getString("login");
                    String senha = rs.getString("senha");
                    Character sexo = rs.getString("sexo") != null ? rs.getString("sexo").charAt(0) : null;
                    return new Usuario(id, login, senha, sexo);
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    public boolean update(Usuario usuario) {
        String sql = "UPDATE Usuarios SET login = ?, senha = ?, sexo = ? WHERE id = ?";
        boolean result = false;

        try (PreparedStatement stmt = super.con.prepareStatement(sql)) {
            stmt.setString(1, usuario.getLogin());
            stmt.setString(2, usuario.getSenha());

            if (usuario.getSexo() != null) {
                stmt.setString(3, usuario.getSexo().toString());
            } else {
                stmt.setNull(3, java.sql.Types.CHAR);
            }

            stmt.setInt(4, usuario.getId());

            int rowsUpdated = stmt.executeUpdate();
            result = rowsUpdated > 0;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return result;
    }

    public boolean delete(int id) {
        String sql = "DELETE FROM Usuarios WHERE id = ?";
        boolean result = false;

        try (PreparedStatement stmt = super.con.prepareStatement(sql)) {
            stmt.setInt(1, id);
            int rowsDeleted = stmt.executeUpdate();
            result = rowsDeleted > 0;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return result;
    }
}
