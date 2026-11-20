#!/usr/bin/env python3
"""Tiny dependency-free server for the Fuera de temporada prototype."""
import argparse
import http.server
import os
import socketserver


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


def main():
    parser = argparse.ArgumentParser(description="Serve Fuera de temporada")
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", "8805")))
    parser.add_argument("--host", default=os.environ.get("HOST", "0.0.0.0"))
    args = parser.parse_args()
    directory = os.path.dirname(os.path.abspath(__file__))
    handler = lambda *a, **kw: http.server.SimpleHTTPRequestHandler(*a, directory=directory, **kw)
    with ReusableTCPServer((args.host, args.port), handler) as server:
        print("Fuera de temporada: http://127.0.0.1:%d/" % args.port)
        print("Red local: abrí http://IP-LAN:%d/ desde otro dispositivo" % args.port)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")


if __name__ == "__main__":
    main()
