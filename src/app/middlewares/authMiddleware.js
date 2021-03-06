import * as Yup from 'yup';

// Importa conexao do axios criada em services/auth.js
import auth from '../../services/auth';

export default async (req, res, next) => {
  const schema = Yup.object().shape({
    token: Yup.string().required(),
  });

  // Verifica se existe token no header
  if (!(await schema.isValid(req.headers))) {
    return res.send(403, { Error: 'Token não fornecido' });
  }
  const { token } = req.headers;

  const axiosConfig = {
    headers: {
      token,
    },
  };

  try {
    // Valida token presente no header, caso seja inválido retorna erro
    await auth.post('/auth/validateToken', null, axiosConfig);

    return next();
  } catch (error) {
    const message =
      error.message !== ''
        ? error.message
        : 'Erro de autenticação, faça login novamente';
    return res.send(401, { Error: message });
  }
};
