// 密钥对生成 http://web.chacuo.net/netrsakeypair

// import JSEncrypt from "jsencrypt";

// const publicKey =
//   "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqA0E/fKebHVh87TBd9IbcH8b46LtxHbY8tk/tW+ShRxLQQyP5cSx73v7ufnSKw1T/3lhwl84q7DDyisfWFl2+wue8Z2DSmSo1R8l8O6qJPkPDZIz3So/OUXmu9keU4R2DsRGGXAdoKe9mjLu//+j1ekpIfRz8e3uxEfBzC54HQ+voud8mV6Mr/UDeQEMaSOB+6K37pfFXxKViEywV9NqGBXVFusFCRYYUu0nz7dApswaFwbVBt/aSQPxR8lkZ9Up10Z4IlKVRTLxr1yMmM70DdoI+d//OoBT1VoQTO2OOkIoKo75fjCWVqYmvYe8UnCNKNY8rGuRsxkiiAdI0h9JwIDAQAB";

// const privateKey =
//   "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCoDQT98p5sdWHztMF30hv5wfxvjou3Edtjy2T+1b5KFHEtBDI/lxLHve/u5+dIrDVP/eWHCXzirsMPKKx9YWXb7C57xnYNKZKjVHyXw7qok+Q8NkjPdKj85Rea72R5ThHYOxEYZcB2gp72aMu7//6PV6Skh9HPx7e7ER8HMLngdD6+i53yZXoyv9QN5AQxpI4H7orful8VfEpWITLBX02oYFdUW6wUJFhhS7SfPt0CmzBoXBtUG39pJA/FHyWRn1SnXRngiUpVFMvGvXIyYzvQN2gj53/86gFPVWhBM7Y46Qigqjvl+MJZWpia9h7xScI0o1jysa5GzGSKIB0jSH0nAgMBAAECggEAYUdQGXTFkkEM15dN2v+MZDKP3z/jzrCOkCEgMIgoZBebQBTKxZa9L1TavDAP6TiOj+SIZnfujAXgMjk4SEgGP51jdxD2Kz5ifRueF/gcaBNcLiK6WSTN4b73wB9NyQ6RM9tVVQspszB/tmIJdaWFhRKV4wwgPyf8SlRp4q6pGq0fMxYrF1QiR6b1TXuUfqkb28QZc1kF+bbcze7wJNLImzAijJ+1JbGgxKUiJ4EsEvtu7ng5oHRjUlB/6xKEx/OABWOn7XftYoEpCkQfb3JUBB/kbNNp0FYHjCsz6qzH3XUq9vha6VeoyDyedxc0A0NdeMpA7xh5yBAX5chgF8gzQQKBgQDdcXfzmRB9AaVgEOHJHwH02D5mn4Yste9R8+A5ZvV71LXdNDxTUfbzHVd40S4g8EyR2iaYdYBxJ2sqXB3A5EwtNm8YcYbW8VdRRu8Fc3UFwafCJfpMt0NLieufE+4Uxmn4WErs23o6SxbtjszKC34PGyozTL4+NPmbatWhitID4QKBgQDCRo5E6MKE2VENO6v1FKKfMxpTv0XY8YFAjiv1zG9wFqs6VMu7wZJPKe8uQeEtaQ5tCgOaJUqL5L/FU4DWaXOEjtUYszMLVr1hX5qI0g5Xl26Zfxd47UsnT+lWJpfuxy8TjD3oJG/EFIRdD/8fO/H7o8he7FSCTlBFss0Qk9aiBwKBgQDNK6GY2Lu3JrxD2sBnqMwWP/jo+mrFqDe5dbzNUoCmH/n0nr458JpevFPcQ+t6Z0p6ZGYYId5EeOJI2BpVKvENfv7F5gGpyug9DPzOzx+gmsHFF4zmYXH/XiUqObwAEaoDiEK7W8rOkd4HcqR5mtZMRr3909/8IPcXsY+H4egd4QKBgACg4czvQ9HSMiTs0H2Wd4A0Vh13PO6auWRQEWxWIPYn3J3vsEkHM0X2SMPJisTu1hEcOy7AeCFDuCsXPg9zf+Ap5h6SVdPvj+VEvec7Zrh50O3GL3lAq0GRTJvuvAcVtd1GUtzxYTstJdB3QMgFFZ9OxFMqSIuzXScckPVAxSz5AoGAQ4JfMh3Hzf7CHx12QiQdOLCwK2MM5OOnenCnaFrMz57rMNxzko3tOr4QsS/KD+wKbhWrYyVCuVT17W8pnO1JODLsa7yMXdvVVc3rsO4/gRy+j/GuWz3cxsU8sKDJ0pI7f3d11A1DAlusLBGR3+6dsGeM2K5k/lmWgWZA0waZ14w=";

// // 加密
// export function encrypt(txt: string) {
//   const encryptor = new JSEncrypt();
//   encryptor.setPublicKey(publicKey); // 设置公钥
//   return encryptor.encrypt(txt); // 对需要加密的数据进行加密
// }

// // 解密
// export function decrypt(txt: string) {
//   const decryptor = new JSEncrypt();
//   decryptor.setPrivateKey(privateKey); // 设置私钥
//   return decryptor.decrypt(txt); // 对需要加密的数据进行解密
// }
