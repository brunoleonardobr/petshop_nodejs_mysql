const conexao = require("../infraestrutura/conexao")
const moment = require("moment")
class Atendimento {
  adiciona(atendimento, res) {
    const dataCriacao = moment().format('YYYY-MM-DD')
    const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD')

    const dataEhValida = moment(data).isSameOrAfter(dataCriacao)
    const clienteEhValido = atendimento.cliente.length >= 5

    const validacoes = [
      {
        nome: 'data',
        valido: dataEhValida,
        message: 'Data deve ser maior ou igual a data atual'
      },
      {
        nome: 'cliente',
        valido: clienteEhValido,
        message: 'Cliente deve ter pelo menos cinco caracteres'
      }
    ]

    const erros = validacoes.filter(campo=>!campo.valido)
    const existemErros = erros.length

    if (existemErros) {
      res.status(400).json(erros)
    } else {
      const atendimentoComData = { ...atendimento, dataCriacao, data}
      const sql = 'INSERT INTO Atendimentos SET ?'
      conexao.query(sql, atendimentoComData, (erro, resultados) =>{
        if(erro){
          res.status(400).json(erro)
        }else{
          res.status(201).json({atendimento})
        }
      })
    }
  }

  lista(res) {
    const sql = `SELECT * FROM atendimentos;`
    conexao.query(sql, (erro,resultados)=>{
      if(erro){
        res.status(400).json(erro)
      } else {
        res.status(200).json(resultados)
      }
    })
  }

  buscaPorId(id, res) {
    const sql = `SELECT * FROM atendimentos WHERE id=${id}`
    conexao.query(sql, (erro, resultados)=>{
      const atendimento = resultados[0]
      if(erro) {
        res.status(400).json(erro)
      } else {
        res.status(200).json(atendimento)
      }
    })
  }

  altera(id, valores, res){

    if(valores.data){
      valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD')
    }
    const sql = `UPDATE atendimentos SET ? WHERE id= ?`
    conexao.query(sql, [valores,id], (erro, resultados)=>{
      if(erro){
        res.status(400).json(erro)
      } else {
        res.status(200).json({...valores, id})
      }
    })
  }

  deleta(id, res){
    const sql = `DELETE FROM atendimentos WHERE id=?`
    conexao.query(sql,id,(erro,resultados)=>{
      if(erro){
        res.status(400).json(erro)
      }else {
        res.status(200).json({id})
      }
    })
  }
}

module.exports = new Atendimento