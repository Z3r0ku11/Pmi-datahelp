import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, Header, Footer } from 'docx';
import { FileNameService } from './FileNameService';

interface DocumentMetadata {
  title: string;
  code?: string;
  version?: string;
  framework?: string;
  project?: string;
  client?: string;
  projectManager?: string;
  date?: string;
}

interface ExportOptions {
  data: any;
  fileName: string;
  toolId?: string;
  metadata?: DocumentMetadata;
}

export class WordExportService {
  static async exportDocument(options: ExportOptions): Promise<void> {
    const { data, fileName, toolId, metadata } = options;

    let doc: Document;

    switch (toolId) {
      case 'TOOL-PMO-005':
        doc = this.createMinutesDocument(data, metadata);
        break;
      case 'TOOL-PMO-003':
        doc = this.createStatusReportDocument(data, metadata);
        break;
      case 'TOOL-PMO-001':
        doc = this.createProjectInfoDocument(data, metadata);
        break;
      default:
        doc = this.createGenericDocument(data, metadata);
    }

    const buffer = await Packer.toBuffer(doc);
    this.downloadFile(new ArrayBuffer(buffer.byteLength), fileName);
  }

  private static createMinutesDocument(data: any, metadata?: DocumentMetadata): Document {
    const { meetingInfo, participantes, agenda, puntosTratados, acuerdos, tareasPendientes, proximaReunion } = data;

    const children: any[] = [];

    // Title
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "MINUTA DE REUNIÓN",
            bold: true,
            size: 32, // 16pt
            font: "Poppins"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    // Meeting Info
    if (meetingInfo) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "INFORMACIÓN GENERAL",
              bold: true,
              size: 28, // 14pt
              font: "Poppins"
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      );

      const infoItems = [
        { label: "Título", value: meetingInfo.titulo },
        { label: "Fecha", value: meetingInfo.fecha },
        { label: "Horario", value: `${meetingInfo.horaInicio} - ${meetingInfo.horaFin}` },
        { label: "Modalidad", value: meetingInfo.modalidad },
        { label: "Organizador", value: meetingInfo.organizador }
      ];

      if (meetingInfo.lugar) {
        infoItems.push({ label: "Lugar", value: meetingInfo.lugar });
      }
      if (meetingInfo.urlReunion) {
        infoItems.push({ label: "URL Reunión", value: meetingInfo.urlReunion });
      }

      infoItems.forEach(item => {
        if (item.value) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${item.label}: `,
                  bold: true,
                  size: 22, // 11pt
                  font: "Poppins"
                }),
                new TextRun({
                  text: item.value,
                  size: 22, // 11pt
                  font: "Poppins"
                })
              ],
              alignment: AlignmentType.JUSTIFIED,
              spacing: { lineRule: "auto", line: 276 } // 1.15 line spacing
            })
          );
        }
      });

      if (meetingInfo.objetivo) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Objetivo: ",
                bold: true,
                size: 22,
                font: "Poppins"
              }),
              new TextRun({
                text: meetingInfo.objetivo,
                size: 22,
                font: "Poppins"
              })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { lineRule: "auto", line: 276 }
          })
        );
      }
    }

    // Participants
    if (participantes && participantes.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "PARTICIPANTES",
              bold: true,
              size: 28,
              font: "Poppins"
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      );

      const participantRows = participantes.map((p: any) => 
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: p.nombre,
                      size: 22,
                      font: "Poppins"
                    })
                  ]
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: p.rol,
                      size: 22,
                      font: "Poppins"
                    })
                  ]
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: p.organizacion,
                      size: 22,
                      font: "Poppins"
                    })
                  ]
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: p.presente ? "Presente" : "Ausente",
                      size: 22,
                      font: "Poppins",
                      color: p.presente ? "008000" : "FF0000"
                    })
                  ]
                })
              ]
            })
          ]
        })
      );

      const participantTable = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Nombre",
                        bold: true,
                        size: 22,
                        font: "Poppins"
                      })
                    ]
                  })
                ]
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Rol",
                        bold: true,
                        size: 22,
                        font: "Poppins"
                      })
                    ]
                  })
                ]
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Organización",
                        bold: true,
                        size: 22,
                        font: "Poppins"
                      })
                    ]
                  })
                ]
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Asistencia",
                        bold: true,
                        size: 22,
                        font: "Poppins"
                      })
                    ]
                  })
                ]
              })
            ]
          }),
          ...participantRows
        ],
        width: {
          size: 100,
          type: WidthType.PERCENTAGE
        }
      });

      children.push(participantTable);
    }

    // Agenda
    if (agenda && agenda.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "AGENDA",
              bold: true,
              size: 28,
              font: "Poppins"
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      );

      agenda.forEach((item: any, index: number) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${item.orden}. `,
                bold: true,
                size: 22,
                font: "Poppins"
              }),
              new TextRun({
                text: `${item.tema} `,
                size: 22,
                font: "Poppins"
              }),
              new TextRun({
                text: `(${item.responsable}, ${item.tiempoEstimado} min)`,
                size: 22,
                font: "Poppins",
                italics: true
              })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { lineRule: "auto", line: 276 }
          })
        );

        if (item.notas) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `   Notas: ${item.notas}`,
                  size: 20,
                  font: "Poppins",
                  italics: true
                })
              ],
              alignment: AlignmentType.JUSTIFIED
            })
          );
        }
      });
    }

    // Points Discussed
    if (puntosTratados && puntosTratados.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "PUNTOS TRATADOS",
              bold: true,
              size: 28,
              font: "Poppins"
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      );

      puntosTratados.forEach((punto: any, index: number) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${punto.tema}`,
                bold: true,
                size: 22,
                font: "Poppins"
              })
            ],
            spacing: { before: 200 }
          })
        );

        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: punto.descripcion,
                size: 22,
                font: "Poppins"
              })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { lineRule: "auto", line: 276 }
          })
        );

        if (punto.decision) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "Decisión: ",
                  bold: true,
                  size: 22,
                  font: "Poppins"
                }),
                new TextRun({
                  text: punto.decision,
                  size: 22,
                  font: "Poppins"
                })
              ],
              alignment: AlignmentType.JUSTIFIED
            })
          );
        }
      });
    }

    // Agreements
    if (acuerdos && acuerdos.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "ACUERDOS Y COMPROMISOS",
              bold: true,
              size: 28,
              font: "Poppins"
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      );

      const agreementRows = acuerdos.map((acuerdo: any) => 
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: acuerdo.descripcion,
                      size: 22,
                      font: "Poppins"
                    })
                  ]
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: acuerdo.responsable,
                      size: 22,
                      font: "Poppins"
                    })
                  ]
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: acuerdo.fechaCompromiso,
                      size: 22,
                      font: "Poppins"
                    })
                  ]
                })
              ]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: acuerdo.prioridad,
                      size: 22,
                      font: "Poppins"
                    })
                  ]
                })
              ]
            })
          ]
        })
      );

      const agreementTable = new Table({
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Compromiso",
                        bold: true,
                        size: 22,
                        font: "Poppins"
                      })
                    ]
                  })
                ]
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Responsable",
                        bold: true,
                        size: 22,
                        font: "Poppins"
                      })
                    ]
                  })
                ]
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Fecha",
                        bold: true,
                        size: 22,
                        font: "Poppins"
                      })
                    ]
                  })
                ]
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Prioridad",
                        bold: true,
                        size: 22,
                        font: "Poppins"
                      })
                    ]
                  })
                ]
              })
            ]
          }),
          ...agreementRows
        ],
        width: {
          size: 100,
          type: WidthType.PERCENTAGE
        }
      });

      children.push(agreementTable);
    }

    // Pending Tasks
    if (tareasPendientes && tareasPendientes.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "TAREAS PENDIENTES",
              bold: true,
              size: 28,
              font: "Poppins"
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      );

      tareasPendientes.forEach((tarea: any, index: number) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. `,
                bold: true,
                size: 22,
                font: "Poppins"
              }),
              new TextRun({
                text: tarea.descripcion,
                size: 22,
                font: "Poppins"
              }),
              new TextRun({
                text: ` (${tarea.responsable} - ${tarea.fechaVencimiento})`,
                size: 22,
                font: "Poppins",
                italics: true
              })
            ],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { lineRule: "auto", line: 276 }
          })
        );
      });
    }

    // Next Meeting
    if (proximaReunion && proximaReunion.fecha) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "PRÓXIMA REUNIÓN",
              bold: true,
              size: 28,
              font: "Poppins"
            })
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        })
      );

      const nextMeetingItems = [
        { label: "Fecha", value: proximaReunion.fecha },
        { label: "Hora", value: proximaReunion.hora },
        { label: "Modalidad", value: proximaReunion.modalidad },
        { label: "Responsable Organización", value: proximaReunion.responsableOrganizacion }
      ];

      nextMeetingItems.forEach(item => {
        if (item.value) {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: `${item.label}: `,
                  bold: true,
                  size: 22,
                  font: "Poppins"
                }),
                new TextRun({
                  text: item.value,
                  size: 22,
                  font: "Poppins"
                })
              ],
              alignment: AlignmentType.JUSTIFIED
            })
          );
        }
      });

      if (proximaReunion.agenda) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: "Agenda Tentativa: ",
                bold: true,
                size: 22,
                font: "Poppins"
              }),
              new TextRun({
                text: proximaReunion.agenda,
                size: 22,
                font: "Poppins"
              })
            ],
            alignment: AlignmentType.JUSTIFIED
          })
        );
      }
    }

    return new Document({
      sections: [{
        properties: {},
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Morris & Opazo",
                    size: 18,
                    font: "Poppins",
                    color: "666666"
                  })
                ],
                alignment: AlignmentType.RIGHT
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Generado el ${new Date().toLocaleDateString('es-CL')}`,
                    size: 16,
                    font: "Poppins",
                    color: "666666"
                  })
                ],
                alignment: AlignmentType.CENTER
              })
            ]
          })
        },
        children
      }]
    });
  }

  private static createStatusReportDocument(data: any, metadata?: DocumentMetadata): Document {
    // Implement status report document creation
    return this.createGenericDocument(data, metadata);
  }

  private static createProjectInfoDocument(data: any, metadata?: DocumentMetadata): Document {
    // Implement project info document creation
    return this.createGenericDocument(data, metadata);
  }

  private static createGenericDocument(data: any, metadata?: DocumentMetadata): Document {
    const children = [
      new Paragraph({
        children: [
          new TextRun({
            text: metadata?.title || "Documento PMO",
            bold: true,
            size: 32,
            font: "Poppins"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: JSON.stringify(data, null, 2),
            size: 22,
            font: "Poppins"
          })
        ]
      })
    ];

    return new Document({
      sections: [{
        properties: {},
        children
      }]
    });
  }

  private static downloadFile(buffer: ArrayBuffer, fileName: string): void {
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}