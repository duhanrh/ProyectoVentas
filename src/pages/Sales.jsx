import 'bootstrap/dist/css/bootstrap.min.css';
import { FormSales } from 'components/FormSales';
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import { Dialog, Tooltip } from '@material-ui/core';
import { getSales, createSale, updateSale, deleteSale } from 'utils/api/sales';
import ReactLoading from 'react-loading';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/modulo.css';

export const Sales = () => {

    const [mostrarTabla, setMostrarTabla] = useState(true);
    const [sales, setSales] = useState([])
    const [textButton, setTextButton] = useState("Crear Venta");
    const [iconButton, setIconButton] = useState("fa fa-user-plus")
    const [tituloModulo, setTituloModulo] = useState("MODULO DE VENTAS")
    const [iconModulo, setIconModulo] = useState("fa fa-table")
    const [ejecutarConsulta, setEjecutarConsulta] = useState(true);
    const [loading, setLoading] = useState(false);

    //LISTADO VENTAS
    useEffect(() => {
      const fetchVentas = async () => {
        setLoading(true);
        await getSales(
          (response) => {
            console.log("la respuesta que se recibio fue", response);
            setSales(response.data);
            setEjecutarConsulta(false);
            setLoading(false);
          },
          (error) => {
            console.error("Salio un error:", error);
            setLoading(false);
          }
        );
      };
      console.log("consulta", ejecutarConsulta);
      if (ejecutarConsulta) {
        fetchVentas();
      }
    }, [ejecutarConsulta]);

    useEffect(() => {
        if (mostrarTabla) {
            setEjecutarConsulta(true);
            setTextButton("Crear Venta");
            setIconButton("fa fa-user-plus px-1")
            setTituloModulo("MODULO DE VENTAS")
            setIconModulo("fa fa-table")
        } else {
            setEjecutarConsulta(false);
            setTextButton("Listar Ventas");
            setIconButton("fa fa-list px-2")
            setTituloModulo("NUEVA VENTA")
            setIconModulo("fab fa-wpforms")
        }
    }, [mostrarTabla])

    return (
        <div className="containerModulo">
            <div class="card shadow">
                <div class="card-header">
                    <h3 class="m-0 font-weight-bold">
                        <i className={iconModulo}></i> <span className="title py-3">{tituloModulo}</span>
                    </h3>
                    <div>
                        <button type="button" className="btn btn-primary btn-block"
                            onClick={() => {
                                setMostrarTabla(!mostrarTabla);
                            }} >
                            <i className={iconButton}></i>{textButton}
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="row">
                        {
                            mostrarTabla ? (
                                <TableSales  loading={loading} listaVentas={sales}setEjecutarConsulta={setEjecutarConsulta}
        />
                            ) : (<FormSales />)
                            
                        }
                        <ToastContainer position='bottom-center' autoClose={5000} />
                    </div>
                </div>
            </div>
        </div>
    )
}

const TableSales = ({ loading, listaVentas, setEjecutarConsulta }) => {
    const [busqueda, setBusqueda] = useState('');
    const [ventasFiltradas, setVentasFiltradas] = useState(listaVentas);

    useEffect(() => {
        setVentasFiltradas(
          listaVentas.filter((elemento) => {
            return JSON.stringify(elemento).toLowerCase().includes(busqueda.toLowerCase());
          })
        );
      }, [busqueda, listaVentas]);

    return (
      <>
        <div className="container">
          <div className="row">
            <div className="col-3"></div>
            <div className="col-8">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <span className="span input-group-prepend input-group-text">
                  {" "}
                  <i className="fa fa-search"></i>
                </span>
              </div>
            </div>
          </div>
          <div className="table-responsive d-none d-sm-none d-md-block">
            {
              loading ? 
              (
                <ReactLoading
                  type="bars"
                  color="#0D6EFD"
                  height={667}
                  width={375}
                />
              ) 
              : 
              (
                <table data-toggle="table" className="table table-striped table-hover "
                  data-toolbar="#toolbar"
                  data-filter-control="true"
                  data-filter-control-container="#filter"
                >
                  <thead className="tableStyle">
                    <tr>
                      <th className="thTableId">#</th>
                      <th className="thTable" style={{"width":"50%"}}>Producto</th>
                      <th className="thTable">Precio</th>
                      <th className="thTable">Cantidad</th>
                      <th className="thTableAcciones">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventasFiltradas.map((venta) => {
                      return (
                        <FilaVenta
                          key={nanoid()}
                          venta={venta}
                          setEjecutarConsulta={setEjecutarConsulta}
                        />
                      );
                    })}
                  </tbody>
                </table>
              )
            }
          </div>
            {ventasFiltradas.map((lav) => {
              return (
                <div className="card d-block d-sm-block d-md-none">
                  <img
                    className="card-img-top"
                    src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22286%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20286%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17c80916396%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17c80916396%22%3E%3Crect%20width%3D%22286%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22107.1953125%22%20y%3D%2296.3%22%3E286x180%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                    alt={lav.descripcion} style={{"height" : "100px"}}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{lav.descripcion} </h5>
                    <p className="card-text">
                      <span>{lav.precio_unitario} </span>
                      <br />
                      <span>{lav.cantidad} </span>
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </>
    );
}

const FilaVenta = ({ venta, setEjecutarConsulta }) => {
    const [edit, setEdit] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [infoNuevoVenta, setInfoNuevaVenta] = useState({
      _id: venta._id,
      descripcion: venta.descripcion,
      precio_unitario: venta.precio_unitario,
      cantidad: venta.cantidad,
    });
  
    const actualizarVenta = async () => {
      //enviar la info al backend
  
      await updateSale(
        venta._id,
        {
          descripcion: infoNuevoVenta.descripcion,
          precio_unitario: infoNuevoVenta.precio_unitario,
          cantidad: infoNuevoVenta.cantidad,
        },
        (response) => {
          console.log(response.data);
          toast.success('Venta modificada con éxito');
          setEdit(false);
          setEjecutarConsulta(true);
        },
        (error) => {
          toast.error('Error modificando la venta');
          console.error(error);
        }
      );
    };
  
    const eliminarVenta = async () => {
      await deleteSale(
        venta._id,
        (response) => {
          console.log(response.data);
          toast.success('Venta eliminada con éxito');
          setEjecutarConsulta(true);
        },
        (error) => {
          console.error(error);
          toast.error('Error eliminando la venta');
        }
      );
  
      setOpenDialog(false);
    };
  
    return (
      <tr>
        {edit ? (
          <>
            <td>{infoNuevoVenta._id}</td>
            <td>
              <input
                className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                type='text'
                value={infoNuevoVenta.descripcion}
                onChange={(e) => setInfoNuevaVenta({ ...infoNuevoVenta, descripcion: e.target.value })}
              />
            </td>
            <td>
              <input
                className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                type='number'
                value={infoNuevoVenta.precio_unitario}
                onChange={(e) =>
                  setInfoNuevaVenta({ ...infoNuevoVenta, precio_unitario: e.target.value })
                }
               required/>
            </td>
            <td>
              <input
                className='bg-gray-50 border border-gray-600 p-2 rounded-lg m-2'
                type='text'
                value={infoNuevoVenta.cantidad}
                onChange={(e) =>
                  setInfoNuevaVenta({ ...infoNuevoVenta, cantidad: e.target.value })
                }
              />
              <select hidden>
                  <option value="">Seleccione opción</option>
                  <option value="Disponible">Disponible</option>
                  <option value="No disponible">No disponible</option>
              </select>
            </td>
          </>
        ) : (
          <>
            <td>{venta._id.slice(20)}</td>
            <td>{venta.descripcion}</td>
            <td>{venta.precio_unitario}</td>
            <td>{venta.cantidad}</td>
          </>
        )}
        <td>
          <div className='justify-around'>
            {edit ? (
              <>
                <Tooltip title='Confirmar Edición' arrow>
                  <i
                    onClick={() => actualizarVenta()}
                    className='fas fa-check bg-success'
                  />
                </Tooltip>
                <Tooltip title='Cancelar edición' arrow>
                  <i
                    onClick={() => setEdit(!edit)}
                    className='fas fa-ban bg-warning'
                  />
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title='Editar Venta' arrow>
                  <i
                    onClick={() => setEdit(!edit)}
                    className='fas fa-pencil-alt bg-warning'
                  />
                </Tooltip>
                <Tooltip title='Eliminar Venta' arrow>
                  <i
                    onClick={() => setOpenDialog(true)}
                    className='fas fa-trash bg-danger'
                  />
                </Tooltip>
              </>
            )}
          </div>
          <Dialog open={openDialog}>
            <div>
              <h1 className='text-gray font-bold'>
                ¿Está seguro de querer eliminar la venta?
              </h1>
              <div className='justify-center my-4'>
                <button
                  onClick={() => eliminarVenta()}
                  className='mx-2 px-4 py-2 btn btn-success text-white rounded-md shadow-md'
                >
                  Sí
                </button>
                <button
                  onClick={() => setOpenDialog(false)}
                  className='mx-2 px-4 py-2 btn btn-danger text-white rounded-md shadow-md'
                >
                  No
                </button>
              </div>
            </div>
          </Dialog>
        </td>
      </tr>
    );
  };
  